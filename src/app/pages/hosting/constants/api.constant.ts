import { AUTH_GROUP, HOSTING_GROUP, LIST_PROPERTY_GROUP, USER_GROUP } from 'src/app/constants/api-group.constant';

export const GET_PROPERTY_TYPES = `${HOSTING_GROUP}/property-types`;
export const GET_AMENITIES = `${HOSTING_GROUP}/amenities`;
export const GET_BED_TYPES = `${HOSTING_GROUP}/bed-types`;
export const GET_HOME_DETAILS = `${HOSTING_GROUP}/home-details`;
export const GET_HOME_RULES = `${HOSTING_GROUP}/home-rules`;

export const UPLOAD_IMAGE = `${HOSTING_GROUP}/upload-images`;
export const DELETE_IMAGE = `${HOSTING_GROUP}/remove-images`;


export const PROPERTY_TYPE = `${LIST_PROPERTY_GROUP}/type`;
export const PROPERTY_BEDS = `${LIST_PROPERTY_GROUP}/beds`;
export const PROPERTY_ADDRESS = `${LIST_PROPERTY_GROUP}/address`;
export const PROPERTY_LOCATION = `${LIST_PROPERTY_GROUP}/location`;
export const PROPERTY_AMENITIES = `${LIST_PROPERTY_GROUP}/amenities`;
export const PROPERTY_GUEST_REQUIREMENTS = `${LIST_PROPERTY_GROUP}/guest-requirements`;
export const PROPERTY_HOUSE_RULES = `${LIST_PROPERTY_GROUP}/house-rules`;
export const PROPERTY_DETAILS = `${LIST_PROPERTY_GROUP}/property-details`;
export const PROPERTY_PHOTOS = `${LIST_PROPERTY_GROUP}/photos`;
export const PROPERTY_DESCRIPTION = `${LIST_PROPERTY_GROUP}/description`;
export const PROPERTY_NAME = `${LIST_PROPERTY_GROUP}/name`;
export const PROPERTY_AVAILABILITY = `${LIST_PROPERTY_GROUP}/availability`;

export const USER_PHONE_NUMBER = `${USER_GROUP}/phone-number`;
export const RESEND_OTP = `${AUTH_GROUP}/resend-otp`;
export const MY_PROFILE = `${USER_GROUP}/my-profile`;
export const UPDATE_PROFILE_PHOTO = `${USER_GROUP}/profile-photo`;

export const PROPERTY_PHONE_NUMBER = `${LIST_PROPERTY_GROUP}/phone-number`;
export const PROPERTY_PRICING = `${LIST_PROPERTY_GROUP}/pricing`;
export const PROPERTY_LAWS_AND_CALENDER = `${LIST_PROPERTY_GROUP}/laws-and-calender`;
export const PROPERTY_QUESTIONS = `${LIST_PROPERTY_GROUP}/questions`;
export const PROPERTY_DISCOUNTS = `${LIST_PROPERTY_GROUP}/discounts`;
export const PROPERTY_PREVIEW = `${LIST_PROPERTY_GROUP}/preview`;
export const PROPERTY_PUBLISH = `${LIST_PROPERTY_GROUP}/publish`;
export const PROPERTY_DATA_UPDATE = `${LIST_PROPERTY_GROUP}/get-property`;

export const MY_PROPERTIES = `${HOSTING_GROUP}/my-properties`;
export const DELETE_PROPERTIES = `${HOSTING_GROUP}/delete-properties`;

