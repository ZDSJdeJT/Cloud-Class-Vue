import axios from 'axios';
import Component from 'vue-class-component';
import { Vue, Inject } from 'vue-property-decorator';
import AccountService from '@/account/account.service';
import { PasswordCompileAndUncompile } from '@/utils/password-compile-and-uncompile';
@Component({
  watch: {
    $route() {
      this.$root.$emit('bv::hide::modal', 'login-page');
    },
  },
})
export default class LoginForm extends Vue {
  @Inject('accountService')
  private accountService: () => AccountService;
  public authenticationError = null;
  public login = null;
  public password = null;
  public rememberMe: boolean = null;

  public doLogin(): void {
    const data = { username: this.login, password: this.password, rememberMe: this.rememberMe };
    axios
      .post('api/authenticate', data)
      .then(result => {
        const bearerToken = result.headers.authorization;
        if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
          const jwt = bearerToken.slice(7, bearerToken.length);
          if (this.rememberMe) {
            localStorage.setItem('jhi-authenticationToken', jwt);
          } else {
            sessionStorage.setItem('jhi-authenticationToken', jwt);
          }
        }
        this.authenticationError = false;
        this.$root.$emit('bv::hide::modal', 'login-page');
        this.accountService().retrieveAccount();
        if (this.password == 'user') {
          this.$store.commit('firstLogin');
          this.$router.push({ path: '/account/password' }); //首次登录，跳转到改密码页面
        } else {
          this.$router.push({ path: '/info/first' }); //登录成功，跳转到主页
        }
      })
      .catch(() => {
        this.authenticationError = true;
      });
  }
}
