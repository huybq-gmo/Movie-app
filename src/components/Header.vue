<template>
    <div class="card">
        <Menubar :model="menuItems">
            <!-- Logo hoặc tiêu đề -->
            <template #start>
                <h2 class="text-xl font-bold text-primary cursor-pointer" @click="gotoHome">Phim Hay</h2>
            </template>

            <!-- Tuỳ chỉnh mục menu -->
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex items-center px-4 py-2" v-bind="props.action" @click="navigate(item)"
                    :class="{ 'active-menu': isActiveRoute(item.path) }">
                    <i :class="[item.icon, 'mr-2']" v-if="item.icon"></i>
                    <span>{{ item.label }}</span>
                    <i v-if="hasSubmenu"
                        :class="['pi pi-angle-down ml-2', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
                </a>
            </template>

            <!-- Ô tìm kiếm + avatar -->
            <template #end>
                <div class="flex items-center gap-2 h-full search-box">
                    <InputText v-model="searchQuery" placeholder="Tìm kiếm phim..." class="w-40 sm:w-60" />
                    <Button icon="pi pi-search" class="p-button-rounded p-button-text" @click="searchMovie" />
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                </div>
            </template>
        </Menubar>
        <!-- <p style="color: aliceblue;">{{ searchQuery }}</p> -->
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { useSearchStore } from "@/store/searchStore";

const router = useRouter();
const searchQuery = ref("");


// Danh sách menu
const menuItems = ref([
    { label: "Phim Mới", icon: "pi pi-star", path: "/" },
    { label: "Phim Lẻ", icon: "pi pi-camera", path: "/loai-phim/phim-le" },
    { label: "Phim Bộ", icon: "pi pi-video", path: "/loai-phim/phim-bo" },
    { label: "Hoạt Hình", icon: "pi pi-moon", path: "/loai-phim/hoat-hinh" },
    {
        label: "Thể Loại",
        icon: "pi pi-th-large",
        items: [
            { label: "Hành Động", path: "/the-loai/hanh-dong" },
            { label: "Hài Hước", path: "/the-loai/hai-huoc" },
            { label: "Kinh Dị", path: "/the-loai/kinh-di" },
            { label: "Tình Cảm", path: "/the-loai/tinh-cam" },
            { label: "Viễn Tưởng", path: "/the-loai/vien-tuong" },
        ]
    },
    {
        label: "Quốc Gia",
        icon: "pi pi-globe",
        items: [
            { label: "Việt Nam", path: "/quoc-gia/viet-nam" },
            { label: "Hàn Quốc", path: "/quoc-gia/han-quoc" },
            { label: "Mỹ", path: "/quoc-gia/au-my" },
            { label: "Nhật Bản", path: "/quoc-gia/nhat-ban" },
        ]
    }
]);
// search 
const searchStore = useSearchStore();
const searchMovie  = () => {
    if (searchQuery.value.trim()) {
        searchStore.setSearchQuery(searchQuery.value.trim());
       
    }
};
watch(searchQuery, (newQuery) => {
  searchStore.setSearchQuery(newQuery.trim());

});
// Thêm hàm kiểm tra route active
const isActiveRoute = (path: string) => {
    if (!path) return false;
    // Kiểm tra chính xác path
    if (path === '/') {
        return router.currentRoute.value.path === '/';
    }
    return router.currentRoute.value.path === path ||
        router.currentRoute.value.fullPath === path ||
        router.currentRoute.value.path.startsWith(path);
};

// Cập nhật hàm navigate
const navigate = (item: any) => {
    if (item.path) {
        router.push(item.path);
        // Reset search query khi chuyển trang
        searchQuery.value = "";
    }
};



// Về trang chủ
const gotoHome = () => {
    router.push("/");
};

</script>

<style scoped>
/* Giao diện tối */
:deep(.p-menubar) {
    background-color: black;
    color: floralwhite;
    border-radius: 0;
    border-bottom: 2px solid #ffcc00;
}

/* Mục menu mặc định */
:deep(.p-menubar-item-link) {
    color: floralwhite;
    background-color: transparent !important;
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

/* Hover đổi màu nền */
:deep(.p-menubar-item-link:hover) {
    background-color: #333 !important;
    color: #ffcc00 !important;
}

/* Khi mục menu active */
:deep(.p-menuitem-active)>.p-menubar-item-link {
    background-color: #333 !important;
    color: #ffcc00 !important;
}


/* Thanh tìm kiếm */
.search-box {
    display: flex;
    align-items: center;
}

.search-box .p-inputtext {
    background: black;
    color: white;
    border: 1px solid gray;
}

.search-box .p-button-text {
    color: white;
}

.search-box .p-button-text:hover {
    background-color: #ffcc00;
    color: black;
}

/* Thêm style cho menu active */
:deep(.active-menu) {
    background-color: #333 !important;
    color: #ffcc00 !important;
    font-weight: bold;
}

/* Thêm hiệu ứng hover cho icon */
:deep(.p-menubar-item-link:hover) i {
    color: #ffcc00;
    transform: scale(1.1);
    transition: all 0.2s ease;
}

/* Style cho icon trong menu */
:deep(.p-menubar-item-link) i {
    transition: all 0.2s ease;
}

:deep(.p-menubar-submenu) {
    background-color: black;
}

:deep(.p-menubar-item-active > .p-menubar-item-content) {
    background: #333;
}

:deep(.p-menubar-item-active) {
    background: #333;
}
</style>
