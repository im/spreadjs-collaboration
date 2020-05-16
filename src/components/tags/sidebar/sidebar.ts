/**
* Sidebar
* @author im <81195314@qq.com>
* @date 2020-05-10 20:57:39
* @since 0.1.0
*/

import Vue from 'components/base'
import { Component, Prop, Watch } from 'vue-property-decorator'
import template from './sidebar.vue'

@Component({
    name: 'tag-sidebar',
    mixins: [template]
})

export default class Sidebar extends Vue {

    get routeName () {
        return this.$route.name
    }
}