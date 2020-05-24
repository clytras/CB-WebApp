import isEmpty from 'lodash.isempty';
import { apiGet } from '@utils/net';


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

  static FetchProfileOfUser(userId) {
    return apiGet(`/api/BusinessProfile/OfAccount${userId ? `/${userId}` : ''}`, { addAuth: true });
  }

  static async GetProfileOfUser(userId) {
    let result;

    try {
      const { ok, json } = await BusinessProfile.FetchProfileOfUser(userId);

      if (ok) {
        result = await json();
      }
    } catch(err) {}

    return new BusinessProfile(result);
  }
}
