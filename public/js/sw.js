var CACHE = {
	name: 'MyDelivery',
	version: '_V1.1.0'
};
var assets = '/traytracking/resources/asset-manifest.json';
var undefinedResponse = 'dW5kZWZpbmVk';
function precacheAssets() {
	fetch(assets, {
		method: "get",
	})
		.then((response) => {
			let promise = Promise.resolve(response.text()).then((text) => {
				jsonResources = JSON.parse(text)
				var ary = ['/traytracking/', '/traytracking/resources/favicon.ico', '/traytracking/resources/logoHome.png', '/traytracking/resources/logo192.png', '/traytracking/resources/logo512.png']
				Object.keys(jsonResources).forEach(function (key) {
					if (!jsonResources[key].endsWith('.map'))
						ary.push(jsonResources[key]);
				});

				caches.open(CACHE.name + CACHE.version).then(function (cache) {
					return cache.addAll(
						ary.map(url => new Request(url, {
							credentials: 'same-origin'
						}))
					);
				})
			})
		});
};

// Install service worker, adding all our cache entries
self.addEventListener('install', function (event) {
	self.skipWaiting();
	console.info('Event: Install');
	event.waitUntil(
		precacheAssets()
	);
});

function checkNetworkState() {
	setInterval(function () {
		if (navigator.onLine) {
			try {
				sendOfflinePostRequestsToServer()
			} catch (err) { console.log(err + 'Error while sending post requests') }

		}
	}, 3000);
}
checkNetworkState();

async function getResponseData(data) {
	let promise = Promise.resolve(data).then((text) => {
		return text
	})
	let result = await promise;
	return result
}

self.addEventListener('fetch', function (event) {
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')
		return;
	if (event.request.method === 'GET') {
		if (event.request.url.includes('/static/') || event.request.mode !== 'cors') {
			event.respondWith(fetchResponseFromCache(event.request))
			return
		}
		if (navigator.onLine) {
			if (event.request.url.includes('/traytracking/fetchDeliveredMealOrders') && !event.request.url.includes('/traytracking/fetchDeliveredMealOrders/?unitId=-1')) {
				//update cache for unit id : -1
				resp = updateCacheRecoveredForAllUnits(event.request)
				event.respondWith(resp)
				return
			}
			event.respondWith(cacheRequest(event.request));
		} else {
			var resp;
			event.waitUntil(
				resp = fetchResponseFromCache(event.request).then((r) => { return r }).catch((e) => { return; }))
			if (resp)
				event.respondWith(resp)
			else
				return;

		}
	}
	else {
		var markTrayAsDelivered = event.request.url.includes('/traytracking/markTrayAsDelivered')
		var undoDeliveredMealOrder = event.request.url.includes('/traytracking/undoDeliveredMealOrder')
		var recoverMealOrder = event.request.url.includes('/traytracking/recoverMealOrder')
		var undoRecoveredMealOrder = event.request.url.includes('/traytracking/undoRecoveredMealOrder')
		if (markTrayAsDelivered || undoDeliveredMealOrder || recoverMealOrder || undoRecoveredMealOrder) {
			var authHeader = event.request.headers.get('Authorization');
			var reqUrl = event.request.url;
			Promise.resolve(event.request.text()).then((payload) => {
				eventTime = new Date();
				if (!navigator.onLine) {
					saveIntoIndexedDb(reqUrl, authHeader, payload, eventTime)
				}
				if (markTrayAsDelivered) {
					updateStatusToDelivered(authHeader, payload, eventTime);
				} else if (undoDeliveredMealOrder) {
					updateStatusToDeparted(authHeader, payload)
				} else if (recoverMealOrder) {
					updateStatusFromRecovered(authHeader, payload, 'RECOVERED')
				} else if (undoRecoveredMealOrder) {
					updateStatusFromRecovered(authHeader, payload, 'DELIVERED')
				}

				return payload
			})
			if (!navigator.onLine) {
				event.respondWith(new Response('OK'))
			}

		}
	}
});

async function updateStatusToDelivered(authHeader, mealOrderId, eventTime) {
	var id = JSON.parse(mealOrderId).id
	var myRequest = new Request('/traytracking/fetchReadyToDeliverCarts');
	myRequest.mode = 'cors'
	myRequest.headers = { 'Authorization': authHeader }
	var updatedMealOrder;
	var resp = await fetchResponseFromCache(myRequest, true)
	if (resp && resp !== undefinedResponse) {
		var decryptedResp = JSON.parse(atob(resp))
		for (var i = 0; i < decryptedResp.length; i++) {
			if (decryptedResp[i].mealOrders && decryptedResp[i].mealOrders.length > 0) {
				for (var j = 0; j < decryptedResp[i].mealOrders.length; j++) {
					if (decryptedResp[i].mealOrders[j].id === id) {
						decryptedResp[i].mealOrders[j].trackingStatus = 'DELIVERED'
						decryptedResp[i].mealOrders[j].deliveredDateTime = eventTime
						updatedMealOrder = decryptedResp[i].mealOrders[j];
						break;
					}
				}
			}
			if (updatedMealOrder)
				break;
		}
		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest, new Response(btoa(JSON.stringify(decryptedResp)))));
	}
	var myRequest2 = new Request('/traytracking/fetchDeliveredMealOrders/?unitId=-1');
	myRequest2.mode = 'cors'
	myRequest2.headers = { 'Authorization': authHeader }
	var decryptedResp2;
	var resp2;
	var respExists = await checkIfRequestExistsInCache(myRequest2)
	if (respExists)
		resp2 = await fetchResponseFromCache(myRequest2, true)
	if (resp2 && resp2 !== undefinedResponse) {
		decryptedResp2 = JSON.parse(atob(resp2));
		var alreadyExists = false
		decryptedResp2.map((mealOrder) => {
			if (mealOrder && mealOrder.id === updatedMealOrder.id && mealOrder.trackingStatus === 'DELIVERED') {
				mealOrder = updatedMealOrder
				alreadyExists = true;
			}
			return mealOrder;
		})
		if (!alreadyExists)
			decryptedResp2[decryptedResp2.length] = updatedMealOrder;
	} else {
		decryptedResp2 = [updatedMealOrder]
	}
	if (decryptedResp2)
		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest2, new Response(btoa(JSON.stringify(decryptedResp2)))));
}

async function updateStatusToDeparted(authHeader, mealOrderId) {
	var id = JSON.parse(mealOrderId).id
	var myRequest = new Request('/traytracking/fetchReadyToDeliverCarts');
	myRequest.mode = 'cors'
	myRequest.headers = { 'Authorization': authHeader }
	var updatedMealOrder;
	var resp = await fetchResponseFromCache(myRequest, true)
	var decryptedResp = JSON.parse(atob(resp))
	for (var i = 0; i < decryptedResp.length; i++) {
		if (decryptedResp[i].mealOrders && decryptedResp[i].mealOrders.length > 0) {
			for (var j = 0; j < decryptedResp[i].mealOrders.length; j++) {
				if (decryptedResp[i].mealOrders[j].id === id) {
					decryptedResp[i].mealOrders[j].trackingStatus = 'DEPARTED'
					decryptedResp[i].mealOrders[j].deliveredDateTime = null
					updatedMealOrder = decryptedResp[i].mealOrders[j];
					break;
				}
			}
		}
		if (updatedMealOrder)
			break;
	}

	caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest, new Response(btoa(JSON.stringify(decryptedResp)))));
	var myRequest2 = new Request('/traytracking/fetchDeliveredMealOrders/?unitId=-1');
	myRequest2.mode = 'cors'
	myRequest2.headers = { 'Authorization': authHeader }
	var resp2;
	var respExists = await checkIfRequestExistsInCache(myRequest2)
	if (respExists)
		resp2 = await fetchResponseFromCache(myRequest2, true)

	if (resp2 && resp2 !== undefinedResponse) {
		var index = [];
		var decryptedResp2 = JSON.parse(atob(resp2));
		decryptedResp2.forEach((mealOrder, i) => {
			if (mealOrder && mealOrder.id === id) {
				index.push(i);
			}
		})
		// can there be a scenario if there's more than one element in index?
		if (index.length > 0) {
			delete decryptedResp2[index];
		}
		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest2, new Response(btoa(JSON.stringify(decryptedResp2)))));
	}
}


async function updateCacheRecoveredForAllUnits(request) {
	var responseForSelectedUnit = await cacheRequest(request);
	var response = await fetchResponseFromCache(request, true)
	var myRequest = new Request('/traytracking/fetchDeliveredMealOrders/?unitId=-1');
	myRequest.mode = 'cors'
	myRequest.headers = request.headers
	var resp = await fetchResponseFromCache(myRequest, true)
	var decryptedResp, decryptedResp2;
	if (response && response !== undefinedResponse) {
		var decryptedResp = JSON.parse(atob(response))
	}
	if (resp && resp !== undefinedResponse) {
		var decryptedResp2 = JSON.parse(atob(resp))
	}
	if (decryptedResp && decryptedResp2) {
		decryptedResp2.map((mealOrder2, index2) => {
			decryptedResp.forEach((mealOrder, index) => {
				if (mealOrder.id === mealOrder2.id) {
					mealOrder2 = mealOrder;
				}
			})
			return mealOrder2;
		})
		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest, new Response(btoa(JSON.stringify(decryptedResp2)))));
	}
	var myRequest2 = new Request('/traytracking/fetchReadyToDeliverCarts');
	myRequest2.mode = 'cors'
	myRequest2.headers = request.headers
	var resp2;
	var respExists = await checkIfRequestExistsInCache(myRequest2)
	if (respExists)
		resp2 = await fetchResponseFromCache(myRequest2, true)
	if (resp2 && resp2 !== undefinedResponse) {
		var decryptedRespCart = JSON.parse(atob(resp2))
		decryptedRespCart.map((cart) => {
			cart.mealOrders.map((mealOrder) => {
				decryptedResp2.forEach((mealOrder2) => {
					if (mealOrder.id === mealOrder2.id) {
						mealOrder.trackingStatus = mealOrder2.trackingStatus
					}
				});
				return mealOrder
			})
			return cart;
		})
	}
	return responseForSelectedUnit;
}
async function updateStatusFromRecovered(authHeader, mealOrderId, currentStatus) {
	var id = JSON.parse(mealOrderId).id
	var myRequest = new Request('/traytracking/fetchDeliveredMealOrders/?unitId=-1');
	myRequest.mode = 'cors'
	myRequest.headers = { 'Authorization': authHeader }
	var resp = await fetchResponseFromCache(myRequest, true)
	var updatedMealOrder;
	if (resp && resp !== undefinedResponse) {
		var decryptedResp = JSON.parse(atob(resp))
		for (var i = 0; i < decryptedResp.length; i++) {
			if (decryptedResp[i] !== null && decryptedResp[i].id === id) {
				decryptedResp[i].trackingStatus = currentStatus;
				updatedMealOrder = decryptedResp[i]
				break;
			}
		}
		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest, new Response(btoa(JSON.stringify(decryptedResp)))));
	}
	var myRequest2 = new Request('/traytracking/fetchReadyToDeliverCarts');
	myRequest2.mode = 'cors'
	myRequest2.headers = { 'Authorization': authHeader }
	var resp2;
	var respExists = await checkIfRequestExistsInCache(myRequest2)
	if (respExists)
		resp2 = await fetchResponseFromCache(myRequest2, true)
	if (resp2 && resp2 !== undefinedResponse) {
		var decryptedResp2 = JSON.parse(atob(resp2))
		for (var i = 0; i < decryptedResp2.length; i++) {
			var updated = false;
			if (decryptedResp2[i].mealOrders && decryptedResp2[i].mealOrders.length > 0) {
				for (var j = 0; j < decryptedResp2[i].mealOrders.length; j++) {
					if (decryptedResp2[i].mealOrders[j].id === id) {
						decryptedResp2[i].mealOrders[j] = updatedMealOrder;
						updated = true
						break;
					}
				}
			}
			if (updated)
				break;
		}

		caches.open(CACHE.name + CACHE.version).then(cache => cache.put(myRequest2, new Response(btoa(JSON.stringify(decryptedResp2)))));
	}
}

async function sendFetchRequestsToServer(data, reqUrl, authHeader, payload, records) {

	let promise = Promise.resolve(data).then((response) => {

		console.log('Successfully sent request to server')
		if (records.length != 0) {

			sendFetchRequestsToServer(
				fetch(records[0].url, {
					method: "post",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': records[0].authHeader
					},
					body: records[0].payload
				}), records[0].url, records[0].authHeader, records[0].payload, records.slice(1))
		}
		return true
	}).catch((e) => {
		console.log('Exception while sending post request to server' + e)
		saveIntoIndexedDb(reqUrl, authHeader, payload)
	})
}

async function sendOfflinePostRequestsToServer() {
	var request = indexedDB.open("TrayTrackingPostDB");
	request.onsuccess = function (event) {
		var db = event.target.result;
		var tx = db.transaction('postrequest', 'readwrite');
		var store = tx.objectStore('postrequest');
		var allRecords = store.getAll();
		allRecords.onsuccess = function () {
			var allRec = allRecords.result
			if (allRecords.result && allRecords.result.length > 0) {

				var records = allRec

				var resp = sendFetchRequestsToServer(
					fetch(records[0].url, {
						method: "post",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': records[0].authHeader
						},
						body: records[0].payload
					}), records[0].url, records[0].authHeader, records[0].payload, records.slice(1))
				allRec.forEach((record) => {
					store.delete(record.id)
				})
			}
		};
	}
	request.onupgradeneeded = function (event) {
		var db = event.target.result;
		db.onerror = function (event) {
			console.log("Why didn't you allow my web app to use IndexedDB?!");
		};

		var objectStore;
		if (!db.objectStoreNames.contains('postrequest')) {
			objectStore = db.createObjectStore("postrequest", { keyPath: 'id', autoIncrement: true });
		}
		else {
			objectStore = db.objectStoreNames.get('postrequest');
		}
	}
}

function getCurrentTimeString(date) {

	var aaaa = date.getFullYear();
	var gg = date.getDate();
	var mm = (date.getMonth() + 1);

	if (gg < 10)
		gg = "0" + gg;

	if (mm < 10)
		mm = "0" + mm;

	var cur_day = aaaa + "-" + mm + "-" + gg;

	var hours = date.getHours()
	var minutes = date.getMinutes()
	var seconds = date.getSeconds();

	if (hours < 10)
		hours = "0" + hours;

	if (minutes < 10)
		minutes = "0" + minutes;

	if (seconds < 10)
		seconds = "0" + seconds;

	return cur_day + " " + hours + ":" + minutes + ":" + seconds;

}


function saveIntoIndexedDb(url, authHeader, payload, eventTime) {
	var myRequest = {};
	jsonPayLoad = JSON.parse(payload)
	if (eventTime)
		jsonPayLoad['eventTime'] = getCurrentTimeString(eventTime)
	myRequest.url = url;
	myRequest.authHeader = authHeader;
	myRequest.payload = JSON.stringify(jsonPayLoad);
	var request = indexedDB.open("TrayTrackingPostDB");
	request.onsuccess = function (event) {
		var db = event.target.result;
		var tx = db.transaction('postrequest', 'readwrite');
		var store = tx.objectStore('postrequest');
		store.add(myRequest)
	}
}

async function cacheResponse(cache, request, response, data) {
	var responseToCache;
	try {
		if (!request.url.includes('/static/') && request.mode === 'cors') {

			var responseData = await getResponseData(data)

			responseToCache = new Response(btoa(responseData), {
				headers: response.clone().headers
			})
		} else {
			responseToCache = response.clone()
		}
		cache.put(request, responseToCache);
	} catch (err) {
	}
	return response;
}


const cacheRequest = request => caches.open(CACHE.name + CACHE.version).then(cache =>

	fetch(request.clone(), {
		credentials: 'same-origin'
	})
		.then(response =>
			cacheResponse(cache, request.clone(), response, response.clone().text()))
);

const fetchResponseFromCache = (request, returnResponseData) =>
	caches.open(CACHE.name + CACHE.version).then(cache =>
		cache.match(request, { ignoreVary: true }).then(response => returnResponseFromCache(request, response, returnResponseData, cache))
	);

const checkIfRequestExistsInCache = (request) =>
	caches.open(CACHE.name + CACHE.version).then(cache =>
		cache.match(request, { ignoreVary: true }).then(response => { return response })
	);

async function returnResponseFromCache(request, response, returnResponseData, cache) {

	if (response && !request.url.includes('/static/') && request.mode === 'cors') {
		var responseData = await getResponseData(response.text())
		if (returnResponseData)
			return responseData
		response = new Response(atob(responseData), {
			headers: response.headers
		})
	}

	if (!!response) {
		return response;
	} else {
		console.log(request.url + ' not yet cached!')
		return fetch(request, { credentials: 'same-origin' }).then(response => cacheResponse(cache, request, response))
	}
}


// Activate service worker
self.addEventListener('activate', (event) => {
	console.info('Event: Activate');
	event.waitUntil(
		self.clients.claim(),
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE.name + CACHE.version) {
						return caches.delete(cache);
					}
				})
			);
		})
	);
});