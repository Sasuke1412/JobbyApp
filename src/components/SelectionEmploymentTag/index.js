import './index.css'

const SelectionEmploymentTag = props => {
  const {details, handleEmploymentQueryParameter} = props
  const {label, employmentTypeId} = details
  const handleChangeInInput = event => {
    console.log(employmentTypeId, event.target.checked)
    handleEmploymentQueryParameter(employmentTypeId, event.target.checked)
  }

  return (
    <li>
      <input
        type="checkBox"
        value={employmentTypeId}
        id={employmentTypeId}
        Checked={false}
        onChange={handleChangeInInput}
      />
      <label className="text-white" htmlFor={employmentTypeId}>
        {label}
      </label>
    </li>
  )
}
export default SelectionEmploymentTag
