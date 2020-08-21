import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import { useDispatch } from 'react-redux'
import { updateProjectSettings, discardProjectSettingsDialog } from '../store/actions/settings'

const styles = makeStyles({
  paper: {
    position: 'absolute',
    top: 50,
    width: 510,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 45
  },
  title: {
    marginBottom: 10
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 20
  },
  formControl: {
    width: '100%'
  },
  textField: {
    width: 80,
    marginRight: 20
  },
  button: {
    textTransform: 'none!important',
    marginLeft: 10
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  applyButtonLabel: {
    color: 'white'
  }
})

export default () => {
  const classes = styles()
  const dispatch = useDispatch()

  return <Paper elevation={4} className={classes.paper}>
    <Typography className={classes.title} variant='h6'>Model Optimization Settings</Typography>
    <Typography className={classes.sectionTitle}>What optimizer did you use to train your model?</Typography>
    <FormControl variant='outlined' className={classes.formControl}>
      <InputLabel id='optimizer-label'>Select an optimizer</InputLabel>
      <Select
        labelId='optimizer-label'
        defaultValue='1'
        size='small'
        label='Select an optimizer'>
        <MenuItem value='1'>SGD</MenuItem>
        <MenuItem value='2'>Adam</MenuItem>
        <MenuItem value='3'>RMSprop</MenuItem>
        <MenuItem value='4'>AdaGrad</MenuItem>
        <MenuItem value='5'>Momentum</MenuItem>
      </Select>
    </FormControl>
    <Typography className={classes.sectionTitle}>Learning rate range</Typography>
    <TextField className={classes.textField} variant='outlined' size='small' label='Initial LR' value={0.1}></TextField>
    <TextField className={classes.textField} variant='outlined' size='small' label='Final LR' value={0.001}></TextField>
    <Typography className={classes.sectionTitle}>Epochs to train</Typography>
    <TextField className={classes.textField} variant='outlined' size='small' label='Epochs' value={95}></TextField>
    <div className={classes.buttonsContainer}>
      <Button
        size='large'
        onClick={() => dispatch(discardProjectSettingsDialog())}
        className={classes.button}>
          Cancel
      </Button>
      <Button
        onClick={() => dispatch(updateProjectSettings({}))}
        color='secondary'
        variant='contained'
        size='large'
        classes={{ root: classes.button, label: classes.applyButtonLabel }}>
          Apply
      </Button>
    </div>
  </Paper>
}
