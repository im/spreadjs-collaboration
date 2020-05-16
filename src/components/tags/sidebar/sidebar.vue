<!--
* Sidebar
* @author im <81195314@qq.com>
* @date 2020-05-10 20:57:39
* @since 0.1.0
-->

<template>
    <ul class="sidebar">
        <li :class="{ active: routeName.indexOf('my') > -1 }">
            <!-- <a href="/#/desktop"> -->
            <router-link :to="{ name: 'my' }">
                <i class="icongongzuotai iconfont"></i>
                <span>我的文档</span>
            </router-link>
            <!-- </a> -->
        </li>
        <li :class="{ active: routeName.indexOf('recent') > -1 }">
            <!-- <a href="/#/desktop/recent"> -->
            <router-link :to="{ name: 'recent' }">
                <i class="iconzuijinliulan iconfont"></i>
                <span>最近浏览</span>
            </router-link>
            <!-- </a> -->
        </li>
        <li :class="{ active: routeName.indexOf('stared') > -1 }">
            <!-- <a href="/#/desktop/stared"> -->
            <router-link :to="{ name: 'stared' }">
                <i class="iconshoucang iconfont"></i>
                <span>星标文档</span>
            </router-link>
            <!-- </a> -->
        </li>
    </ul>
</template>
<style src="./sidebar.styl" lang="stylus" scoped></style>