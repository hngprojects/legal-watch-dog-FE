# Legal WatchDog API Endpoints

## Waitlist

**POST** `/api/v1/waitlist/signup` – Signup Waitlist

---

## Auth

**POST** `/api/v1/auth/register` – Company Signup
**POST** `/api/v1/auth/otp/verification` – Verify Otp
**POST** `/api/v1/auth/otp/requests` – Request New Otp
**GET** `/api/v1/auth/invitations/{token}/accept` – Accept Invitation
**POST** `/api/v1/auth/login` – Login
**POST** `/api/v1/auth/token/refresh` – Refresh Token
**POST** `/api/v1/auth/logout` – Logout
**POST** `/api/v1/auth/password/resets` – Request Password Reset
**POST** `/api/v1/auth/password/resets/verification` – Verify Reset Code
**POST** `/api/v1/auth/password/resets/confirmation` – Confirm Password Reset

---

## Organizations

**POST** `/api/v1/organizations` – Create Organization
**PATCH** `/api/v1/organizations/{organization_id}` – Update Organization
**POST** `/api/v1/organizations/{organization_id}/invitations` – Invite User
**PATCH** `/api/v1/organizations/{organization_id}/members/{user_id}/status` – Update Member Status
**PATCH** `/api/v1/organizations/{organization_id}/members/{user_id}/role` – Update Member Role
**GET** `/api/v1/organizations/{organization_id}/users` – Get All Users In Organization

---

## Users

**GET** `/api/v1/users/me` – Get Current User Profile
**GET** `/api/v1/users/me/invitations` – Get My Invitations
**GET** `/api/v1/users/me/organizations` – Get All User Organizations
**GET** `/api/v1/users/{user_id}/organisations/{organization_id}` – Get User Organization Details
**GET** `/api/v1/users/me/organizations/{organization_id}` – Get Organization Details

---

## Sources

**POST** `/api/v1/sources` – Create Source
**GET** `/api/v1/sources` – Get Sources
**GET** `/api/v1/sources/{source_id}` – Get Source
**PUT** `/api/v1/sources/{source_id}` – Update Source
**DELETE** `/api/v1/sources/{source_id}` – Delete Source
**PATCH** `/api/v1/sources/{source_id}` – Update Source Patch
**POST** `/api/v1/sources/{source_id}/scrapes` – Manual Scrape Trigger

---

## Projects

**POST** `/api/v1/organizations/{organization_id}/projects` – Create Project
**GET** `/api/v1/organizations/{organization_id}/projects` – List Projects In Organization
**GET** `/api/v1/organizations/{organization_id}/projects/{project_id}` – Get Project
**PATCH** `/api/v1/organizations/{organization_id}/projects/{project_id}` – Update Project
**DELETE** `/api/v1/organizations/{organization_id}/projects/{project_id}` – Delete Project

---

## Jurisdictions

**POST** `/api/v1/organizations/{organization_id}/jurisdictions/` – Create Jurisdiction
**GET** `/api/v1/organizations/{organization_id}/jurisdictions/` – Get All Jurisdictions
**GET** `/api/v1/organizations/{organization_id}/jurisdictions/project/{project_id}` – Get Jurisdictions By Project
**DELETE** `/api/v1/organizations/{organization_id}/jurisdictions/project/{project_id}` – Soft Delete Jurisdictions By Project
**GET** `/api/v1/organizations/{organization_id}/jurisdictions/{jurisdiction_id}` – Get Jurisdiction
**PATCH** `/api/v1/organizations/{organization_id}/jurisdictions/{jurisdiction_id}` – Update Jurisdiction
**DELETE** `/api/v1/organizations/{organization_id}/jurisdictions/{jurisdiction_id}` – Soft Delete Jurisdiction
**POST** `/api/v1/organizations/{organization_id}/jurisdictions/{jurisdiction_id}/restoration` – Restore Jurisdiction
**POST** `/api/v1/organizations/{organization_id}/jurisdictions/project/{project_id}/restoration` – Restore Jurisdictions By Project Id

---

## Data Revision Search

**POST** `/api/v1/data-revisions/` – Search Data Revisions

---

## Default

**GET** `/` – Read Root
**GET** `/health` – Health Check
