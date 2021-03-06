import Content from './Content.en-US';
import CountriesISOAlpha3 from './Countries.en-US';

export default {

  hello:'Hello!',
  howAreYou:'How Are You?',

  thisLanguage: 'English',
  languageFlagIso: 'us',
  languageEn: 'English',
  languageEl: 'Greek',
  euroSign: '€',

  titles: {
    PrivacyPolicy: 'Privacy Policy',
    TermsAndConditions: 'Terms and Conditions',
    Open: 'Open',
    Search: 'Search',
    Clear: 'Clear',
    Status: 'Status',
    Date: 'Date',
    DateSlashTime: 'Date/Time',
    FromSlashTo: 'From/To',
    Requests: 'Requests',
    Summary: 'Summary',
    Profile: 'Profile',
    Settings: 'Settings',
    ContactRequests: 'Contact requests',
    Actions: 'Actions',
    LastLogin: 'Last login',
    Registration: 'Registration',
    Roles: 'Roles',
    Edit: 'Edit',
    Delete: 'Delete',
    Discover: 'Discover',
    Register: 'Register',
    Login: 'Login',
    Logout: 'Logout',
    Password: 'Password',
    CurrentPassword: 'Current password',
    NewPassword: 'New password',
    ConfirmPassword: 'Confirm password',
    WrongPassword: 'Wrong password',
    Administrator: 'Administrator',
    MyProfile: 'My Profile',
    Information: 'Information',
    CompanyName: 'Company name',
    DiscoverProfiles: 'Discover Profiles',
    Email: 'Email',
    Name: 'Name',
    Telephone: 'Telephone',
    EmailAddress: 'Email address',
    TelephoneNumber: 'Telephone number',
    Address: 'Address',
    StreenAddress: 'Street address',
    AdditionalAddressInformation: 'Additional address information',
    City: 'City',
    StateRegionProvince: 'State / Region / Province',
    PostalCode: 'Postal code',
    Country: 'Country',
    Countries: 'Countries',
    OtherText: 'Other',
    Save: 'Save',
    Undo: 'Undo',
    RequestProblem: 'Request problem',
    RejectionReason: 'Rejection reason',
    ResponseText: 'Response text',
    SaveProfileInformation: 'Save profile information',
    SaveProfileActivities: 'Save profile activities',
    UseAccountEmailAddress: 'Use account email address',
    ContactPerson: 'Contact person',
    DeleteYourAccount: 'Delete your account',
    DeleteAccount: 'Delete account',
    ChangeYourPassword: 'Change your password',
    ChangePassword: 'Change password',
    ReloadPage: 'Reload page',
    AddNewContentBlock: 'Add new Content Block',
    LockAccount: 'Lock account',
    UnlockAccount: 'Unlock account',
    Lock: 'Lock',
    Unlock: 'Unlock',
    Send: 'Send',
    SendContactRequest: 'Send contact request',
    Nav: {
      Sections: {
        edit: 'Edit',
        dashboard: 'Dashboard',
        users: 'Users',
        content: 'Content'
      }
    }
  },
  validation: {
    Fields: {
      EmptyH: 'Empty {field}',
      EmptyS: 'Empty {field}',
      Empty: 'Empty {field}',
      MustNotBeEmpty: 'The field {field} must not be empty',
      IsRequired: 'The field {field} is required',
      MustBeLengthOf: 'The field {field} must be at least {len} characters',
      MustBeAtLeastLengthOf: 'Must be at least {len} characters',
      IsInvalid: 'The field {field} is invalid',
      PasswordNotMatch: 'Passwords do not match',
      NotValidEmail: 'Not a valid email address',
      InvalidTelephone: 'Must contain {min}-{max} numeric digits',
      NotValidPostalCode: 'Not a valid postal code'
    }
  },
  placeholders: {
    ThisFieldIsRequired: 'This field is required',
    CountriesFilter: 'Filter by Countries',
    CompanyNameFilter: 'Filter by Company Name',
    ActivitiesFilter: 'Filter by Activities'
  },
  fields: {
    duration: {
      Hours: '{hours} {hours_plural}',
      Days: '{days} {days_plural}',
      Weeks: '{weeks} {weeks_plural}',
      Months: '{months} {months_plural}',
      Years: '{years} {years_plural}',
      Permanently: 'Permanently'
    }
  },
  plurals: {
    years: {
      singular: 'year',
      plural: 'years'
    },
    months: {
      singular: 'month',
      plural: 'months'
    },
    weeks: {
      singular: 'week',
      plural: 'weeks' 
    },
    days: {
      singular: 'day',
      plural: 'days'
    },
    hours: {
      singular: 'hour',
      plural: 'hours'
    },
    minutes: {
      singular: 'minute',
      plural: 'minutes'
    },
    seconds: {
      singular: 'second',
      plural: 'seconds'
    }
  },
  ui: {
    blocks: {
      ProfileMasonry: {
        ActivitiesMatchingWith: 'Activities matching with you',
        Activities: 'activities',
        MatchOf: 'match of'
      }
    }
  },
  messages: {
    Auth: {
      AccountNotFound: 'No account found using given credentials',
      AccountLocked: 'Account is locked until {lockedUntil}',
      Account2FA: 'Account requires two factor authentication',
      LoginFail: 'Check you email and password',
      AccountExists: 'An account with that mail already exists',
      RegistrationError: 'There was an error trying to register your account',
      EmailNotMatchRequest: 'The email address does not match with the action request',
      PasswordChangedSuccessfully: 'Your password changed successfully',
      InvalidEmailAddress: 'Invalid email address',
      InvalidPassword: 'Password must have at least 8 character, contain upper/lower letters, digits and symbols',
      ConfirmPasswordNotMatch: 'Confirmation password does not match with the password',
      WeakVulnerablePassword: 'Password is weak or vulnerable',
      ResourceAccessDenied: 'You do not have access to this resource',
      ActionAccessDenied: 'You do not have access to perform this action',
      PasswordResetRequestSent: 'A password reset link has been sent to your email.  \nPlease check your email inbox and follow the reset link to reset your password.',
      PasswordResetSuccess: 'Your password has been reset',
      CouldNotSendPasswordRequest: 'Could not send password request email',
      CouldNotDeleteAccount: 'Could not delete account',
      ActionOnlyForAuth: 'Only logged in accounts can perform this action',
      EmailVerificationSent: 'Email verification sent successfully',
      EmailVerificationNotSent: 'Email verification not sent',
      EmailVerificationSentVisitMail: 'A verification link has now been sent to your email.\nPlease check your email inbox and follow the verification link to verify your email address.',
      CheckCurrentPasswordRetry: 'Check your current password and retry',
      WrongPasswordForDeleteAccount: 'The password you have entrered is wrong.  \nCheck your password and try again.',
      EmailIsVerified: 'Your email address is already verified',
      NoVerifiedEmail: 'Your email address has not been verified.  \nYou need to verify your email address to complete you profile.\n\nPlease check your email inbox and follow the verification link to verify your email address.\n\nVisit your [profile settings](/account/settings) and use the resend email verification action to resend the verification email.',
      // YourEmailConfirmed: 'Your email address is now confirmed.'
      DeleteAccountAndData: 'Delete your account and all of your data.  \n\nThis action cannot be undone.',
      DeleteAccountConfirm: 'Are you sure you want to **delete your account** and all your data?  \n\nAll of your data stored to this platform will be deleted.  \n\nThis action is **final** and **cannot be undone**.  \n\n*Please type your password to continue with the account deletion.*',
      RegisterAgreement: 'I agree to the platform [Terms and Conditions](/terms-and-conditions) and [Privacy Policy](/privacy-policy)'
    },
    Business: {
      BusinessProfileUnvisible: 'Your profile is not visible by others.  \nPlease [contact support](/contact) to request your profile visibility.',
      BusinessProfileNotComplete: 'Your profile is not complete.  \nPeople cannot discover you unless you complete your profile.\n\nPlease visit your [account profile page](/account/profile) and provide your data to complete your profile.',
      NoProfileInformation: 'You have to fill your profile information before you can search and connect with other people.\n\nPlease visit your [account profile page](/account/profile) and provide your data to complete your profile.',
      SaveBasicInformationBeforeActivities: 'Save profile information above to select your activities',
      SendContactRequest: 'Send a contact request to "{companyName}"?  \nAn email with this request will be send to them.'
    },
    CouldNotLoadDataReloadPage: 'Could not load request data.\nIf you keep seeing this, try to reload the page.',
    ActivitiesAutoSave: 'Activities will be saved automatically on selecting options',
    InvalidFieldsDataTryAgain: 'There are some missing fields or fields with wrong information.  \nInput valid data to fix the errors and try again.',
    ProfileInformationSaved: 'Your profile information is now saved.  \nAlso review and update your related activities below.',
    UserHasNoProfile: 'User has no profile information yet',
    AccountCannotBeLocked: 'Account cannot be locked',
    AccountLockedUntil: 'Account is locked until {lockedUntil}',
    LockAccount: 'Lock this account',
    UnlockAccount: 'Unlock this account',
    MakeProfileHidden: 'Make this profile hidden (not shown in search)',
    MakeProfileVisible: 'Make this profile visible (include in search)',
    ErrorSaving: 'Could not complete save request.  \nIf you keep seeing this, try to reload the page.',
    DataSaved: 'Data saved successfully',
    RequestError: 'Request error ({error})',
    ContactSupport: 'Please contact support',
    UnexpectedError: 'There was an unexpected error',
    RequestRejected: 'The request was rejected by the server',
    RequestProblem: 'The request returned an unknown state.\n\nCheck your internet connection and try again.\nIf the problem persists, please try to reload the page.',
    DeleteEntry: 'Are you sure you want to delete this entry?',
    EntryUpdated: 'Entry updated successfully',
    EntryCreated: 'Entry created successfully',
    EntryDeleted: 'Entry deleted successfully',
    TypeYourPassword: 'You must type your password',
    AppNewVersion: '🚀 There is a new application version.\nMake sure to save all unsaved data and reload the page.',
    ProfileHasBeenDeleted: 'Profile has been deleted',
    ContactRequestHasBeenSent: 'You have sent a contact request at {datetime}',
    YouCantSendAnotherContectRequestUntil: 'You cannot send another contact request until {datetime}',
    ContactRequestHasSent: 'Contact request has been sent successfully',
    NoMatchesFound: 'No matches found',
    NoMatchesFoundUsingTerms: 'No matches found using {terms} search terms',
    MatchesFound: 'Found {total} matches',
    MatchesFoundUsingTerms: 'Found {total} matches using {terms} search terms',

    Confirms: {
      UnlockAccount: 'Do you want to unlock user\'s "{email}" account?',
      LockAccountFor: 'Lock user\'s "{email}" account for:',
      MakeProfileVisible: 'Make profile visible',
      MakeProfileVisibleInSearch: 'Do you want to make user\'s "{email}" profile visible in search results?',
      HideProfile: 'Hide profile',
      HideProfileFromSearch: 'Do you want to hide user\'s "{email}" profile from search results?',
      QuestingDeleteContentBlock: 'Delete Content Block Id#{id}',
      QuestionDelete: 'Are you sure you want to delete {for}?',
      DeleteAccount: 'Delete account?',
      for: {
        ContentBlock: 'the content block'
      }
    }
  },
  Business: {
    Lists: {
      TopicsOfInterest: 'Topics of interest',
      CleanPowerTransport: 'Clean power for transport',
      Electromobility: 'Electromobility',
      MicroMobility: 'Micro mobility',
      Biofuels: 'Biofuels',
      HydrogenMobility: 'Hydrogen mobility',
      AirMobility: 'Air mobility ',
      DronesManufacturing: 'Drones manufacturing',
      DronesTrading: 'Drones trading',
      Logistics: 'Logistics',
      LastmileLogistics: 'Last-mile logistics',
      DronesApplicationsForLogistics: 'Drones applications for logistics',
      UrbanMobility: 'Urban mobility',
      SharedMobility: 'Shared mobility',
      TrafficManagementSystems: 'Traffic management systems',
      TransportInfrastructure: 'Transport Infrastructure',
      RailInfrastructure: 'Rail infrastructure',
      RoadInfrastructure: 'Road infrastructure',
      MaritimeInfrastructure: 'Maritime infrastructure',
      AirTransportInfrastructure: 'Air transport infrastructure',
      Automotive: 'Automotive',
      ElectricVehiclesManufacturing: 'Electric vehicles manufacturing',
      ElectricVehiclesTrading: 'Electric vehicles trading',
      AutonomousVehiclesManufacturing: 'Autonomous vehicles manufacturing',
      AutonomousVehiclesTrading: 'Autonomous vehicles trading',
      ICTTransport: 'ICT for transport',
      ITSSystems: 'ITS systems',
      CITSSystems: 'C-ITS systems',
      DataAnalyticsTransport: 'Data analytics for transport',
      TransportPolicy: 'Transport policy',
      ConsultingServices: 'Consulting services ',
      Offer: 'Offer',
      Collaboration: 'Collaboration',
      ForFundingCall: 'For funding call',
      DevelopNewProduct: 'Develop new product',
      DevelopNewService: 'Develop new service',
      TechnicalCooperation: 'Technical cooperation',
      BusinessConsultingServices: 'Business consulting services',
      TransportRelatedConsultingServices: 'Transport related consulting services',
      Request: 'Request',
      Supplier: 'Supplier',
      ForComponents: 'For components',
      ForServices: 'For services',
      ForData: 'For data'
    }
  },
  Collections: {
    Countries: CountriesISOAlpha3
  },
  Content
}
