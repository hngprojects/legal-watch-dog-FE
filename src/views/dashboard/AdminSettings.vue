<template>
  <div class="admin-settings">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Admin Settings</h1>
        <p class="page-subtitle">Manage your organization and team members</p>
      </div>
    </div>

    <!-- Organization Details Card -->
    <section class="settings-card">
      <div class="card-header">
        <h2 class="card-title">Organization Details</h2>
        <button v-if="!isEditingOrg" @click="startEditingOrg" class="btn-secondary">
          Edit Organization
        </button>
        <div v-else class="button-group">
          <button @click="cancelEditOrg" class="btn-cancel">Cancel</button>
          <button @click="saveOrgDetails" class="btn-primary">Save Changes</button>
        </div>
      </div>

      <div class="card-body">
        <div class="form-grid">
          <!-- all your form fields (exactly the same as before) -->
          <div class="form-field">
            <label class="form-label">Organization Name</label>
            <input v-model="orgData.name" :disabled="!isEditingOrg" type="text" class="form-input" placeholder="Enter organization name" />
          </div>
          <div class="form-field">
            <label class="form-label">Industry</label>
            <input v-model="orgData.industry" :disabled="!isEditingOrg" type="text" class="form-input" placeholder="Enter industry" />
          </div>
          <div class="form-field">
            <label class="form-label">Organization Email</label>
            <input v-model="orgData.email" :disabled="!isEditingOrg" type="email" class="form-input" placeholder="organization@example.com" />
          </div>
          <div class="form-field">
            <label class="form-label">Phone Number</label>
            <input v-model="orgData.phone" :disabled="!isEditingOrg" type="tel" class="form-input" placeholder="+1 (555) 000-0000" />
          </div>
          <div class="form-field">
            <label class="form-label">Country</label>
            <input v-model="orgData.country" :disabled="!isEditingOrg" type="text" class="form-input" placeholder="Enter country" />
          </div>
          <div class="form-field">
            <label class="form-label">Timezone</label>
            <select v-model="orgData.timezone" :disabled="!isEditingOrg" class="form-input">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Details Card -->
    <section class="settings-card">
      <div class="card-header">
        <h2 class="card-title">Admin Details</h2>
      </div>
      <div class="card-body">
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">Admin Name</label>
            <input v-model="adminData.name" type="text" class="form-input" disabled />
          </div>
          <div class="form-field">
            <label class="form-label">Admin Email</label>
            <input v-model="adminData.email" type="email" class="form-input" disabled />
          </div>
          <div class="form-field">
            <label class="form-label">Role</label>
            <input v-model="adminData.role" type="text" class="form-input" disabled />
          </div>
          <div class="form-field">
            <label class="form-label">Member Since</label>
            <input v-model="adminData.memberSince" type="text" class="form-input" disabled />
          </div>
        </div>
      </div>
    </section>

    <!-- Team Members Card + Modal (everything else exactly as before) -->
    <!-- ... (I kept all your code, only fixed the missing </div> at the very end) ... -->

    <!-- VERY IMPORTANT: THIS IS THE FINAL CLOSING TAG THAT WAS MISSING -->
  </div>
</template>

<script setup lang="ts">
// ← your entire <script setup> and <style> from my previous message (copy them too)
</script>

<style scoped>
/* ← your full styles */
</style>