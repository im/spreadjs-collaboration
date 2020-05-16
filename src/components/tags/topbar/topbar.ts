/**
* Topbar
* @author im <81195314@qq.com>
* @date 2020-05-10 20:37:11
* @since 0.1.0
*/

import Vue from 'components/base'
import { Component, Prop, Watch } from 'vue-property-decorator'
import template from './topbar.vue'

@Component({
    name: 'tag-topbar',
    mixins: [template]
})

export default class Topbar extends Vue {
    circleUrl =  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
}