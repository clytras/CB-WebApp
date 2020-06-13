import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardTitle, CardSubtitle, Button, FormGroup, Input, Label, Collapse } from 'reactstrap';
import { getProfilesListing } from '@data/BusinessProfile';
import { toast } from 'react-toastify';
import { useStoreOf } from '@stores';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingOverlay from '@components/common/LoadingOverlay';
import { getActivitiesForSelect } from '@data/BusinessProfile/Lists';
import FeedbackMessage from '@components/common/FeedbackMessage';
import BusinessProfileNotice from '@components/Account/BusinessProfileNotice';
import { getCountriesForSelect } from '@data/Countries';
import Select from '@components/common/Select';
import { utsj } from 'lyxlib/utils/time';
import styled from 'styled-components';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';


export default function Profiles() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [userBusinessProfile] = useStoreOf('userBusinessProfile');
  const [loading, setLoading] = useState(true);
  // const [activitiesOptions, setActivitiesOptions] = useState();
  const [searchTerms, setSearchTerms] = useState({});
  const [totalActivitiesOptions, setTotalActivitiesOptions] = useState(0);
  const [profiles, setProfiles] = useState();
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [actionError, setActionError] = useState();
  const [updater, setUpdater] = useState(0);

  useEffect(() => {
    const { hasUser = false } = authUserProfile || {};
    const { hasProfile = false } = userBusinessProfile || {};

    if (hasUser && hasProfile) {
      setActionError();

      const {
        companyName: searchTermCompanyName,
        countries: searchTermCountries,
        activities: searchTermActivities
      } = searchTerms;

      getProfilesListing({
        page, perPage,
        returnActivitiesOptions: updater === 0,
        searchTermCompanyName,
        searchTermCountries,
        searchTermActivities
      })
      .then(async resp => {
        if (resp.ok) {
          const result = await resp.json();
          const { total, data, activitiesOptions } = result || {};

          if (activitiesOptions) {
            setTotalActivitiesOptions(Object.keys(activitiesOptions).length);
          }

          setTotalResults(total);
          setProfiles(prev => (prev || []).concat(data));
        } else {
          setActionError(Strings.messages.CouldNotLoadDataReloadPage);
        }
      })
      .catch(err => toast.error(translateRequestError(err)))
      .finally(() => setLoading(false));
    }
  }, [updater, authUserProfile, userBusinessProfile]);

  const handleRetryClick = () => {
    setLoading(true);
    setUpdater(utsj());
  }
  const handleSearchClick = ({ companyName, countries, activities } = {}) => {
    setLoading(true);
    setProfiles([]);
    setPage(1);
    setSearchTerms({ companyName, countries, activities });
    setUpdater(utsj());
  }
  const handleClearClick = () => handleSearchClick();
  const handleInfiniteScoll = () => {
    console.log('handleInfiniteScoll');

    setPage(prev => ++prev);
    setUpdater(utsj());
  }

  function renderProfile(profile) {
    const { profileId, companyName, city, region, country, activities, matchingActivities } = profile;
    const countryText = country in Strings.Collections.Countries ? Strings.Collections.Countries[country] : country;
    const address = region ? [city, region, countryText] : [city, countryText];
    const percentMatch = Math.round((matchingActivities.length /  totalActivitiesOptions) * 100);

    return (
      <Col key={`profile-card-${profileId}`} xl={4} lg={4} md={6} sm={12} xs={12}>
        <Card body className="profile mb-3">
            <CardTitle className="company-name">{companyName}</CardTitle>
            <CardSubtitle className="address">{address.join(', ')}</CardSubtitle>
            <div className="activities mt-2">
              <div className="title text-secondary">{Strings.ui.blocks.ProfileMasonry.ActivitiesMatchingWith}</div>
              <div className="stats">
                <div className="count">{matchingActivities.length} <span className="text-secondary">{Strings.ui.blocks.ProfileMasonry.Activities}</span></div>
                <div className="percent"><span className="text-secondary">{Strings.ui.blocks.ProfileMasonry.MatchOf}</span> {percentMatch}%</div>
              </div>
            </div>
          <Button color="primary" tag={Link} to={`/discover/profile/${profileId}`}>{Strings.titles.Open}</Button>
        </Card>
      </Col>
    );
  }

  function renderResultsFound() {
    if (loading) return null;

    const total = totalResults;
    let message;
    let terms = 0;

    if (searchTerms.companyName) terms++;
    if (searchTerms.countries) terms += searchTerms.countries.length;
    if (searchTerms.activities) terms += searchTerms.activities.length;

    if (totalResults > 0) {
      if (terms > 0) {
        message = Strings.formatString(Strings.messages.MatchesFoundUsingTerms, { total, terms });
      } else {
        message = Strings.formatString(Strings.messages.MatchesFound, { total });
      }
    } else {
      if (terms > 0) {
        message = Strings.formatString(Strings.messages.NoMatchesFoundUsingTerms, { terms });
      } else {
        message = Strings.messages.NoMatchesFound;
      }
    }

    return <p>{message}</p>;
  }

  return (
    <div className="discover-profiles">
      <Row className="header">
        <Col className="title">
          {Strings.titles.DiscoverProfiles}
        </Col>
      </Row>
      <SearchFilters onSearch={handleSearchClick} onClear={handleClearClick} />
      {renderResultsFound()}
      <div className="reset-font-size">
        <BusinessProfileNotice>
          {profiles ? (
            <InfiniteScroll style={{ overflow: 'initial' }}
              dataLength={profiles.length}
              next={handleInfiniteScoll}
              hasMore={profiles.length < totalResults}
              loader={<LoadingOverlay/>}
            >
              {profiles && profiles.length > 0 && (
                <Row className="profiles">
                  <div style={{ width: '100%' }}>
                    <Masonry option={{ transitionDuration: 0 }}>{profiles.map(renderProfile)}</Masonry>
                  </div>
                </Row>
              )}
            </InfiniteScroll>
          ) : <LoadingOverlay/>}
          {actionError && <FeedbackMessage className="mt-3" color="warning"
            columnSize={8} message={actionError} onRetry={handleRetryClick} />}
        </BusinessProfileNotice>
      </div>
    </div>
  );
}


const SearchFiltersContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SearchTermsContainer = styled(Collapse)`
  font-size: 1rem;
`;

const SearchTermsActions = styled.div`
  text-align: center;
`;

const SearchTermsActionButton = styled(Button)`
  min-width: 20%;
`;

const SearchToggleButton = styled(Button)`
  margin: 0 auto;
  display: block;
  position: relative;
  top: -1px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: .3rem 2.5rem;

  ${({ isOpen }) => isOpen && `
    border-top: 1px solid #f8f9fa !important;
  `}

  &:focus {
    box-shadow: none !important;
  }
`;

export function SearchFilters({ loading, onSearch, onClear }) {
  const countriesOptions = useMemo(() => getCountriesForSelect(), []);
  const activitiesOptions = useMemo(() => Object.entries(
    ['TopicsOfInterest', 'Offer', 'Request']
      .reduce((acc, cur) => ({ ...acc, [cur]: getActivitiesForSelect(cur) }), {})),
  []);
  const [selectedActivities, setSelectedActivities] = useState({ TopicsOfInterest: [], Offer: [], Request: [] });
  const [profileCountriesSelected, setProfileCountriesSelected] = useState([]);
  const [profileCompanyName, setProfileCompanyName] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const handleCountryChange = (values) => {
    setProfileCountriesSelected(values);
    setIsDirty(true);
  }
  const handleCompanyNameChange = ({ currentTarget: { value }}) => {
    setProfileCompanyName(value);
    setIsDirty(true);
  }
  const handleActivitiesChange = head => values => {
    setSelectedActivities(prev => ({ ...prev, [head]: values }));
    setIsDirty(true);
  }

  const handleSearchClick = () => {
    if (onSearch) {
      const countries = (profileCountriesSelected || []).map(({ value }) => value);
      const activities = Object.entries(selectedActivities)
        .map(([, terms]) => (terms || []).map(({ value }) => value))
        .reduce((acc, cur) => acc.concat(cur), []);

      onSearch({
        companyName: profileCompanyName, countries, activities
      });
    }
  }
  const handleClearClick = () => {
    setProfileCompanyName('');
    setProfileCountriesSelected([]);
    setSelectedActivities({ TopicsOfInterest: [], Offer: [], Request: [] });
    onClear && onClear();
  }

  return (
    <SearchFiltersContainer className="border-top">
      <SearchTermsContainer isOpen={isOpen} className="bg-light p-3 border-bottom">

        <Row form>
          <Col md={5} sm={12}>
            <FormGroup>
              <Label for="Profile.CompanyName">{Strings.titles.CompanyName}</Label>
              <Input name="Profile.CompanyName" id="Profile.CompanyName"
                placeholder={`${Strings.placeholders.CompanyNameFilter}...`}
                value={profileCompanyName}
                onChange={handleCompanyNameChange} />
            </FormGroup>
          </Col>
          <Col md={7} sm={12}>
            <FormGroup>
              <Label for="Profile.CompanyLocation.Country">{Strings.titles.Countries}</Label>
              <Select name="Profile.CompanyLocation.Country" inputId="Profile.CompanyLocation.Country"
                placeholder={`${Strings.placeholders.CountriesFilter}...`}
                isMulti
                isClearable
                value={profileCountriesSelected}
                onChange={handleCountryChange}
                options={countriesOptions} />
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          {activitiesOptions.map(([head, options]) => (
            <Col md={4} sm={12} key={`search-filter-activities-for-${head}`}>
              <FormGroup>
                <Label for={`Profile.Activities.${head}`}>{Strings.Business.Lists[head]}</Label>
                <Select name={`Profile.Activities.${head}`} inputId={`Profile.Activities.${head}`}
                  placeholder={`${Strings.placeholders.ActivitiesFilter}...`}
                  closeMenuOnSelect={false}
                  isMulti
                  isClearable
                  value={selectedActivities[head]}
                  onChange={handleActivitiesChange(head)}
                  options={options} />
              </FormGroup>
            </Col>
          ))}
        </Row>

        <SearchTermsActions>
          <SearchTermsActionButton disabled={loading} color="primary px-4" onClick={handleSearchClick}>{Strings.titles.Search}</SearchTermsActionButton>
          <SearchTermsActionButton disabled={loading} className="ml-3 px-4" onClick={handleClearClick}>{Strings.titles.Clear}</SearchTermsActionButton>
        </SearchTermsActions>

      </SearchTermsContainer>
      <SearchToggleButton isOpen={isOpen} className="border text-muted" size="sm" onClick={toggle} color="light">{Strings.titles.Search}</SearchToggleButton>
    </SearchFiltersContainer>
  );
}
