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
