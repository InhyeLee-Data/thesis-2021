<template>
     <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  default header
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  default body
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  default footer
                  <button class="modal-default-button" @click="$emit('close')">
                    OK
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
</template>

<script>

// import $ from "jquery";
import text_modal from '/components/text_modal.vue';

export default {
  name: 'text_modal',
  props: {
      // locationIDs: Array,
      // allKoText: String,
      // allEnText: String,
      KoSegs: Array,
      EnSegs: Array,
      overallLocations: Array,
  },
  components: {
  },
}
</script>