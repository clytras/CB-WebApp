import React, { useMemo } from 'react';
import ReactSelect from 'react-select';


export default function Select({
  maxMenuHeight = 200,
  invalid = false,
  ...rest
}) {
  const styles = useMemo(() => selectStyles({ invalid }), [invalid]);
  return <ReactSelect styles={styles} maxMenuHeight={maxMenuHeight} {...rest} />;
}

const white = '#ffffff';
const bsBorderBlue = '#66afe9';
const bsBorderGrey = '#cccccc';
const bsBorderError = '#dc3545 !important';
const bsBoxShadowBlue = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
const bsBoxShadowGrey = ''; // 'inset 0 1px 1px rgba(0,0,0,.075);';
const bsBoxShadowError = '0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important';
// const bsBackgroundGrey = '#eeeeee';
const bsBackgroundOption = '#f8f9fa';
const bsBackgroundOptionSelected = '#eeeeee';
const bsControlTextColor = '#555555';
const bsControlPlaceholderColor = '#999999';

const selectStyles = ({ invalid }) => ({
    control: (base, state) => ({
        ...base,
        // height: 34,
        // minHeight: 34,
        // backgroundColor: white,
        // borderWidth: 0,
        // boxShadow: 'none',
        // color: bsControlTextColor,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: invalid ? bsBorderError : (
          state.selectProps.menuIsOpen || state.isFocused ? bsBorderBlue : bsBorderGrey),
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        boxShadow: state.selectProps.menuIsOpen || state.isFocused ? (invalid ? bsBoxShadowError : bsBoxShadowBlue) : bsBoxShadowGrey,
        // paddingLeft: 10,
    }),
    valueContainer: (base, state) => ({
        ...base,
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: state.selectProps.menuIsOpen ? bsBorderBlue : bsBorderGrey,
        // borderTopLeftRadius: 4,
        // borderBottomLeftRadius: 4,
        // boxShadow: state.selectProps.menuIsOpen ? bsBoxShadowBlue : bsBoxShadowGrey,
        // paddingLeft: 10,
    }),
    input: base => ({
        ...base,
        color: bsControlTextColor,
    }),
    singleValue: base => ({
        ...base,
        color: bsControlTextColor,
    }),
    placeholder: (base, state) => ({
        display: state.selectProps.menuIsOpen ? 'none' : 'inline',
        color: bsControlPlaceholderColor,
        paddingLeft: 3,
    }),
    // indicatorSeparator: base => ({
    //     display: 'none',
    // }),
    clearIndicator: base => ({
        ...base,
        // borderWidth: 1,
        // borderLeftWidth: 0,
        // borderStyle: 'solid',
        // borderColor: bsBorderGrey,
        // backgroundColor: bsBackgroundGrey,
        // height: 34,
        // width: 39,
        // color: bsControlTextColor,
        // ':hover': {
        //     color: bsControlTextColor,
        // },
    }),
    // dropdownIndicator: base => ({
    //     ...base,
    //     // borderWidth: 1,
    //     // borderLeftWidth: 1,
    //     // borderStyle: 'solid',
    //     // borderColor: bsBorderGrey,
    //     // borderTopRightRadius: 4,
    //     // borderBottomRightRadius: 4,
    //     // backgroundColor: bsBackgroundGrey,
    //     // // height: 34,
    //     // width: 39,
    //     // color: bsControlTextColor,
    //     // ':hover': {
    //     //     color: bsControlTextColor,
    //     // },
    // }),
    option: (base, state) => ({
        ...base,
        color: bsControlTextColor,
        backgroundColor: state.isSelected
            ? bsBackgroundOptionSelected
            : state.isFocused ? bsBackgroundOption : white,
    }),
});
