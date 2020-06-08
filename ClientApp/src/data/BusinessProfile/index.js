import isEmpty from 'lodash.isempty';
import { apiGet, apiPut, apiPost } from '@utils/net';


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

  get isProfileVisible() {
    return this._profile && this._profile.isProfileVisible;
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

  get newContactRequests() {
    return this._profile && this._profile.newContactRequests;
  }
}

export function fetchProfile(profileId) {
  return apiGet(`/api/BusinessProfile/${profileId}`, { addAuth: true });
}

export function saveProfileInformation(params) {
  return apiPut('/api/BusinessProfile/Information', { addAuth: true, params });
}

export function saveProfileActivities(activities) {
  return apiPut('/api/BusinessProfile/Activities', { addAuth: true, params: activities });
}

export function saveProfileOtherActivity(ActivityAlias, OtherText) {
  return apiPut('/api/BusinessProfile/OtherActivity', {
    addAuth: true,
    params: {
      ActivityAlias,
      OtherText
    }
  });
}

export function fetchProfileOfUser(userId) {
  return apiGet(`/api/BusinessProfile/OfAccount${userId ? `/${userId}` : ''}`, { addAuth: true });
}

export async function getProfileOfUser(userId) {
  let result;

  try {
    const resp = await fetchProfileOfUser(userId);

    console.log('GetProfileOfUser:resp', resp);

    if (resp.ok) {
      result = await resp.json();
    }
  } catch(err) {}

  console.log('GetProfileOfUser:result', result);

  return new BusinessProfile(result);
}

export function getProfilesListing({
  returnActivitiesOptions = false
}) {
  return apiPost('/api/BusinessProfile/Listing', {
    addAuth: true,
    params: {
      returnActivitiesOptions
    }
  });
}

export function setProfileOfUserVisibility(UserId, Visibility) {
  return apiPost('/api/BusinessProfile/SetProfileOfUserVisibility', {
    addAuth: true, 
    params: { UserId, Visibility }
  });
}

export function sendContactRequest(ToProfileId) {
  return apiPost('/api/BusinessProfile/SendContactRequest', {
    addAuth: true, 
    params: { ToProfileId }
  });
}
