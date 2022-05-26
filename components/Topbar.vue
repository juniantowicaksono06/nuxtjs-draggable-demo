<style>
    .topbar {
        background-color: rgb(71,98,112);
    }
    .topbar-list {
        display: flex;
        list-style-type: none;
        padding-left: 40px;
        padding-right: 40px;
        margin-bottom: 0;
        margin-top: 0;
        height: 100%;
        line-height: 100%;
    }
    .topbar-list > li.topbar-list-item {
        padding: 15px 15px;
        margin: auto 0;
    }
    .topbar-list > li.topbar-list-item:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
    }
</style>
<template>
    <div class="w-100 text-white px-3 topbar">
        <ul class="topbar-list">
            <li class="topbar-list-item"><span>Workspace <span class="ml-1"><font-awesome-icon :icon="['fa', 'chevron-down']" /></span></span></li>
        </ul>
    </div>
</template>