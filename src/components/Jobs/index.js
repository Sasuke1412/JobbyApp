import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import SelectionEmploymentTag from '../SelectionEmploymentTag'

import SelectionSalaryTag from '../SelectionSalaryTag'

import IndividualJobItem from '../IndividualJobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    failureOfFetch: false,
    userDetails: {},
    searchInput: '',
    salaryParameter: '',
    employeeParameter: '',
    jobsList: [],
    isLoading: false,
    failureToLoadProfile: false,
  }

  componentDidMount() {
    this.profileData()
    this.getAllJobsSection()
  }

  profileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)

      const userDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      // console.log(userDetails)
      this.setState({userDetails})
    }
    if (response.status === 401) {
      this.setState({failureToLoadProfile: true})
    }
  }

  retryProfile = () => {
    this.profileData()
  }

  profileSection = () => {
    const {userDetails, failureToLoadProfile} = this.state
    const {name, profileImageUrl, shortBio} = userDetails

    return (
      <>
        {failureToLoadProfile ? (
          <button type="button" onClick={this.retryProfile()}>
            Retry
          </button>
        ) : (
          <div className="profile-container">
            <img
              src={profileImageUrl}
              alt="profile"
              className="avatar-design"
            />
            <h1 className="user-name">{name}</h1>
            <p className="user-bio">{shortBio}</p>
          </div>
        )}
      </>
    )
  }

  TypesofEmployment = () => (
    <div>
      <h1 className="text-white">Type of Employment</h1>
      <ul className="list-style-none">
        {employmentTypesList.map(each => (
          <SelectionEmploymentTag
            key={each.id}
            details={each}
            handleEmploymentQueryParameter={this.handleEmploymentQueryParameter}
          />
        ))}
      </ul>
    </div>
  )

  handleSalaryQueryParameter = (id, TF) => {
    const salQ = {
      id,
      TF,
    }
    const {salaryParameter} = this.state
    this.setState({salaryParameter: id}, this.getAllJobsSection)
  }

  handleEmploymentQueryParameter = (eId, TF) => {
    const empQ = {
      eId,
      TF,
    }
    const {employeeParameter} = this.state
    this.setState({employeeParameter: eId}, this.getAllJobsSection)
  }

  TypesofSalary = () => (
    <div>
      <h1 className="text-white">Salary Range</h1>
      <ul className="list-style-none">
        {salaryRangesList.map(each => (
          <SelectionSalaryTag
            key={each.salaryRangeId}
            details={each}
            handleSalaryQueryParameter={this.handleSalaryQueryParameter}
          />
        ))}
      </ul>
    </div>
  )

  handleSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getAllJobsSection)
  }

  handleFormSubmittion = event => {
    const {searchInput} = this.state
    event.preventDefault()
    //  console.log(searchInput)
  }

  getAllJobsSection = async () => {
    const {searchInput, salaryParameter, employeeParameter} = this.state
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeParameter}&minimum_package=${salaryParameter}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const arra = data.jobs
    if (response.ok === true) {
      //  console.log(data)
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (arra.length !== 0) {
        this.setState({
          jobsList: updatedData,
          isLoading: false,
          failureOfFetch: false,
        })
      } else if (arra.length === 0) {
        this.setState({
          jobsList: updatedData,
          isLoading: false,
          failureOfFetch: true,
        })
      }
    }
    if (response.status === 401) {
      this.setStatus({failureOfFetch: true})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retry = () => {
    this.getAllJobsSection()
  }

  renderFailureScreen = () => {
    const {jobsList} = this.state
    return (
      <div>
        {jobsList.length === 0 ? (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1 className="text-white">No Jobs Found</h1>
            <p className="text-white">
              We could not find any jobs. Try other filters.
            </p>
          </>
        ) : (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
              alt="failure view"
            />
            <h1 className="text-white">Oops! Something Went Wrong</h1>
            <p className="text-white">
              We cannot seem to find the page you are looking for.
            </p>
            <button type="button" onClick={this.retry}>
              Retry
            </button>
          </>
        )}
      </div>
    )
  }

  renderAllJobs = () => {
    const {jobsList, failureOfFetch} = this.state

    return (
      <div className="bg-container">
        {failureOfFetch ? (
          this.renderFailureScreen()
        ) : (
          <ul>
            {jobsList.map(each => (
              <IndividualJobItem key={each.id} details={each} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  render() {
    const {
      searchInput,
      salaryParameter,
      employeeParameter,
      isLoading,
    } = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="Proile-Query-selector-container">
            {this.profileSection()}
            <hr className="horizontal-divider" />
            {this.TypesofEmployment()}
            {this.TypesofSalary()}
          </div>
          <div className="All-Jobs-Container">
            <div className="search-bar-container">
              <form onSubmit={this.handleFormSubmittion}>
                <input
                  type="search"
                  placeholder="search"
                  value={searchInput}
                  onChange={this.handleSearchInput}
                />
                <button type="submit" testId="searchButton">
                  <BsSearch className="search-icon" />
                </button>
              </form>
            </div>

            {isLoading ? this.renderLoader() : this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
