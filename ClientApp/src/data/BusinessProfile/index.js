import isEmpty from 'lodash.isempty';
import { apiGet, apiPut } from '@utils/net';


export class BusinessProfile  {
  constructor(profile) {
    this._profile = profile;
  }

  get hasProfile() {
    return !!this._profile && !isEmpty(this._profile);
  }

  get profileId() {
    return this._profile && this._profile.profileId;
  }

  get userId() {
    return this._profile && this._profile.userId;
  }

  get email() {
    return this._profile && this._profile.email;
  }

  get telephone() {
    return this._profile && this._profile.telephone;
  }

  get companyName() {
    return this._profile && this._profile.companyName;
  }

  get companyLocation() {
    return this._profile && this._profile.companyLocation;
  }

  get contactPerson() {
    return this._profile && this._profile.contactPerson;
  }

  get activities() {
    return this._profile && this._profile.activities;
  }

  set activities(value) {
    if (this._profile) {
      this._profile.activities = value;
    }
  }

  get activitiesAssoc() {
    if (this.activities && this.activities.length) {
      return this.activities.reduce((assoc, key) => {
        assoc[key] = true;
        return assoc;
      }, {});
    }
    return {};
  }

  get otherActivities() {
    return this._profile && this._profile.otherActivities;
  }

  set otherActivities(value) {
    if (this._profile) {
      this._profile.otherActivities = value;
    }
  }

  static FetchProfile(profileId) {
    return apiGet(`/api/BusinessProfile/${profileId}`, { addAuth: true });
  }

  static SaveProfileInformation(params) {
    return apiPut('/api/BusinessProfile/Information', { addAuth: true, params });
  }

  static SaveProfileActivities(activities) {
    return apiPut('/api/BusinessProfile/Activities', { addAuth: true, params: activities });
  }

  static SaveProfileOtherActivity(ActivityAlias, OtherText) {
    return apiPut('/api/BusinessProfile/OtherActivity', {
      addAuth: true,
      params: {
        ActivityAlias,
        OtherText
      }
    });
  }

  static FetchProfileOfUser(userId) {
    return apiGet(`/api/BusinessProfile/OfAccount${userId ? `/${userId}` : ''}`, { addAuth: true });
  }

  static async GetProfileOfUser(userId) {
    let result;

    try {
      const resp = await BusinessProfile.FetchProfileOfUser(userId);

      console.log('GetProfileOfUser:resp', resp);

      if (resp.ok) {
        result = await resp.json();
      }
    } catch(err) {}

    console.log('GetProfileOfUser:result', result);

    return new BusinessProfile(result);
  }
}
