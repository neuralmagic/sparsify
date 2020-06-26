export const inputStyle = props => ({
  border: '1px solid #787878',
  borderRadius: 3,
  backgroundColor: props.theme === 'light' ? 'white' : '#484A4A',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 10,
  fontSize: 15,
  color: props.theme === 'light' ? 'black' : 'white'
})

export const headerDropdownStyles = {
  dropdown: props => ({
    position: 'relative',
    display: 'flex',
    height: '100%',
    borderRight: '1px solid #3C3E42',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: props.isDropdownContentShown ? 'rgba(49, 129, 202, 1)' : null,
    '&:hover': {
      backgroundColor: 'rgba(49, 129, 202, 1)'
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      right: 0,
      bottom: 0,
      border: '1px solid black'
    },
  }),
  dropdownContent: props => ({
    position: 'absolute',
    left: props.dropdownAlign === 'left' ? 0 : 'inherit',
    right: props.dropdownAlign === 'right' ? 0 : 'inherit',
    top: '100%',
    backgroundColor: '#202325',
    border: '1px solid #3A3A3A',
    boxShadow: 'rgba(0, 0, 0, 0.6) 2px 2px 5px'
  })
}
