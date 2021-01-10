import { maxLength, minLength, required } from 'vuelidate/lib/validators';
import axios from 'axios';
import { mapGetters } from 'vuex';
import Component from 'vue-class-component';
import { Vue, Inject } from 'vue-property-decorator';
import { Button } from 'ant-design-vue';
Vue.use(Button);

const validations = {
  resetPassword: {
    currentPassword: {
      required,
    },
    newPassword: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(24),
    },
    confirmPassword: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(24),
    },
  },
};

@Component({
  validations,
  computed: {
    ...mapGetters(['account']),
  },
})
export default class ChangePassword extends Vue {
  success: string = null;
  error: string = null;
  doNotMatch: string = null;
  resetPassword: any = {
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  };

  public changePassword(): void {
    if (this.resetPassword.newPassword !== this.resetPassword.confirmPassword) {
      this.error = null;
      this.success = null;
      this.doNotMatch = 'ERROR';
    } else {
      this.doNotMatch = null;
      axios
        .post('api/account/change-password', {
          currentPassword: this.resetPassword.currentPassword,
          newPassword: this.resetPassword.newPassword,
        })
        .then(() => {
          sessionStorage.setItem('firstLogin', 'false');
          this.success = 'OK';
          this.error = null;
        })
        .catch(() => {
          this.success = null;
          this.error = 'ERROR';
        });
    }
  }

  public get username(): string {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
  }

  makeCurrentPasswordTypeText() {
    var currentPasswordInput = document.getElementsByName('currentPassword')[0] as HTMLInputElement;
    currentPasswordInput.type = 'text';
  }

  makeCurrentPasswordTypePassword() {
    var currentPasswordInput = document.getElementsByName('currentPassword')[0] as HTMLInputElement;
    currentPasswordInput.type = 'password';
  }

  makeNewPasswordTypeText() {
    var newPasswordInput = document.getElementsByName('newPassword')[0] as HTMLInputElement;
    newPasswordInput.type = 'text';
  }

  makeNewPasswordTypePassword() {
    var newPasswordInput = document.getElementsByName('newPassword')[0] as HTMLInputElement;
    newPasswordInput.type = 'password';
  }
}
