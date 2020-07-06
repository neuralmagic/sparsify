import { compose, merge } from 'ramda'
import { headerDropdownStyles } from '../common/styles/components'
import { Component, fold, useStyles } from '../common/component'
import { useAsDropdownContent, useAsDropdown, useDropdownState, dropdownMenu } from '../common/dropdown'

const helpStyles = {
  ...headerDropdownStyles,
  helpIcon: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginRight: 5,
    flexShrink: 0,
    userSelect: 'none'
  }
}

export default Component(props => compose(
  fold(merge(props, { dropdownAlign: 'right' })),
  useDropdownState,
  useStyles(helpStyles),
  useAsDropdown,
  useAsDropdownContent)(
  dropdownMenu.contramap(props => merge(props, { items: [
    { label: 'Get latest version', icon: 'assets/get_latest_version.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Make a suggestion', icon: 'assets/make_a_suggestion.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Help center', icon: 'assets/help_center.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Community', icon: 'assets/community.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Contact support', icon: 'assets/contact_support.svg', iconWidth: 14, iconHeight: 14 } ] }))))

