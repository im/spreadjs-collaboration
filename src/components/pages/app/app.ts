/**
* App
* @author im <81195314@qq.com>
* @date 2020-05-10 17:41:20
* @since 0.1.0
*/

import Vue from 'components/base'
import { Component, Prop, Watch } from 'vue-property-decorator'
import template from './app.vue'
import Topbar from 'components/tags/topbar'

@Component({
    name: 'page-app',
    mixins: [template],
    components: {
        Topbar
    }
})

export default class App extends Vue {

}