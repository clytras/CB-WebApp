import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { getProfilesListing } from '@data/BusinessProfile';
import { toast } from 'react-toastify';
import Masonry from 'react-masonry-component';
import LoadingOverlay from '@components/common/LoadingOverlay';
import FeedbackMessage from '@components/common/FeedbackMessage';
import { utsj } from 'lyxlib/utils/time';
import { Strings, translateCodeMessage, translateRequestError } from '@i18n';


export default function Profiles() {
  const [loading, setLoading] = useState(true);
  const [activitiesOptions, setActivitiesOptions] = useState();
  const [totalActivitiesOptions, setTotalActivitiesOptions] = useState(0);
  const [profiles, setProfiles] = useState();
  const [actionError, setActionError] = useState();
  const [updater, setUpdater] = useState(0);
  const [openProfileId, setOpenProfileId] = useState();

  useEffect(() => {
    setActionError();

    getProfilesListing({
      returnActivitiesOptions: updater === 0
    })
    .then(async resp => {
      if (resp.ok) {
        const result = await resp.json();

        if (updater === 0) {
          const { profiles, activitiesOptions } = result || {};

          console.log('profiles, activitiesOptions', profiles, activitiesOptions);

          setProfiles(profiles);
          setActivitiesOptions(activitiesOptions);
          setTotalActivitiesOptions(Object.keys(activitiesOptions).length);
        } else {
          setProfiles(result);
        }
      } else {
        setActionError(Strings.messages.CouldNotLoadDataReloadPage);
      }
    })
    .catch(err => toast.error(translateRequestError(err)))
    .finally(() => setLoading(false));
  }, [updater]);

  function renderProfile(profile) {
    const { profileId, companyName, city, region, country, activities, matchingActivities } = profile;
    const address = region ? [city, region, country] : [city, country];
    const percentMatch = Math.round((matchingActivities.length /  totalActivitiesOptions) * 100);

    return (
      // <div className="profile">
      //   <div className="company-name">{companyName}</div>
      //   <div className="address">{address}</div>
      // </div>
      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
        <Card body className="profile mb-3">
            <CardTitle className="company-name">{companyName}</CardTitle>
            <CardSubtitle className="address">{address.join(', ')}</CardSubtitle>
            <div className="activities mt-2">
              <div className="title text-secondary">Activities matching with you</div>
              <div className="stats">
                <div className="count">{matchingActivities.length} <span className="text-secondary">activities</span></div>
                <div className="percent"><span className="text-secondary">match of</span> {percentMatch}%</div>
              </div>
            </div>
            <Button color="primary" tag={Link} to={`/discover/profile/${profileId}`}>Open</Button>
        </Card>
      </Col>
    );
  }

  return (
    <div className="discover-profiles">
      <Row className="header">
        <Col className="title">
          {Strings.titles.DiscoverProfiles}
        </Col>
      </Row>
      <hr/>
      <div className="reset-font-size">
        {profiles && profiles.length && (
          <Row className="profiles">
            <div style={{ width: '100%' }}>
              <Masonry option={{ transitionDuration: 0 }}>{profiles.map(renderProfile)}</Masonry>
            </div>
          </Row>
        )}
        {loading && <LoadingOverlay/>}
        {actionError && <FeedbackMessage className="mt-3" color="warning"
          columnSize={8} message={actionError} onRetry={() => {}} />}
      </div>
    </div>
  );
}
