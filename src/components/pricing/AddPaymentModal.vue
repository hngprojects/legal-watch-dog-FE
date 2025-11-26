<script setup lang="ts">
import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogDescription from '../ui/dialog/DialogDescription.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTitle from '../ui/dialog/DialogTitle.vue'
import DialogTrigger from '../ui/dialog/DialogTrigger.vue'
import Field from '../ui/field/Field.vue'
import FieldGroup from '../ui/field/FieldGroup.vue'
import FieldLabel from '../ui/field/FieldLabel.vue'
import Select from '../ui/select/Select.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectValue from '../ui/select/SelectValue.vue'
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Add Payment Method </DialogTitle>
        <DialogDescription>Enter your payment details.</DialogDescription>
      </DialogHeader>

      <form>
        <FieldGroup>
          <Field>
            <FieldLabel>Card Mumber</FieldLabel>
            <Input placeholder="**** **** **** ****" />
          </Field>
          <div class="flex flex-row gap-8 *:flex-1">
            <Field>
              <FieldLabel>Expiry Date</FieldLabel>
              <Input placeholder="MM/YY" />
            </Field>

            <Field>
              <FieldLabel>CVV</FieldLabel>
              <Input type="password" placeholder="***" />
            </Field>
          </div>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=""></SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Zip/Postal Code</FieldLabel>
            <Input placeholder="eg. 769300" />
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
