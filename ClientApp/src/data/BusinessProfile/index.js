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

  get otherActivities() {
    return this._profile && this._profile.otherActivities;
  }

  static FetchProfile(profileId) {
    return apiGet(`/api/BusinessProfile/${profileId}`, { addAuth: true });
  }

  static SaveProfileInformation(params) {
    return apiPut('/api/BusinessProfile/Information', { addAuth: true, params });
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
