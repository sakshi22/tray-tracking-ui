const styles = theme => ({
    main: {
      width: '99%',
      borderWidth: '10px',
      borderColor: 'black',
      height: '97%',
      display: 'block', // Fix IE 11 issue.
      margin: 'auto',
      
    },
    paper: {
      marginTop: theme.spacing.unit * 1,
      display: 'flex',
      width:'100%',
      height: '97vh',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      backgroundColor: 'rgb(80,127,179)',
      color: 'white',
      marginTop: theme.spacing.unit,
      [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
        width: '40%',
      },
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        width: '40%',
      },
      [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
        width: '27%',
      },
    },
    logoutBtn: {
      extend: 'submit',
      [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
        width: '98%',
      },
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        width: '54%',
      },
      [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
        width: '45%',
      },
    },
    menuBtn: {
      backgroundColor: 'rgb(80,127,179)',
      color: 'white',
      marginTop: theme.spacing.unit,
      
      [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
        width: '100px',
        height: '100px',
        marginLeft: theme.spacing.unit,
      },
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        width: '150px',
        height: '150px',
        marginLeft: theme.spacing.unit*4,
      },
      [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
        width: '200px',
        height: '200px',
        marginLeft: theme.spacing.unit,
      },
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      fontSize: '10px',
      width: '60%',
      marginTop: theme.spacing.unit,
      [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
        width: '50%',
      },
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        width: '40%',
      },
      [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
        width: '26%',
      },
      '& input' :{
        width: '60%',
        height: '5px',
        color:'grey'
       },
       '& label':{
        marginTop: '-7px',
      },
    },
    inlineList:{
      display: 'flex',
      
      [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
        marginLeft: theme.spacing.unit*-6,
      },
      [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
        marginLeft: theme.spacing.unit*-8,
      },
      [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
        marginLeft: theme.spacing.unit*-5.75,
      },
    }
  });
  export default styles;