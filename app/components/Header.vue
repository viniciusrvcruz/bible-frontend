<script setup lang="ts">
import { ref } from 'vue'

const drawerOpen = ref(false)

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const closeDrawer = () => {
  drawerOpen.value = false
}

// Estado ativo do menu (Bíblia está ativo por padrão)
const activeMenu = ref('Bíblia')

type MenuIcon = 'book' | 'document' | 'clock'

interface MenuItem {
  label: string
  href: string
  icon: MenuIcon
}

const menuItems: MenuItem[] = [
  { label: 'Bíblia', href: '/', icon: 'book' },
  { label: 'Anotações', href: '/notes', icon: 'document' },
  { label: 'Registros', href: '/records', icon: 'clock' },
]

const handleMenuClick = (label: string) => {
  activeMenu.value = label
  closeDrawer()
}
</script>

<template>
  <div class="drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-300 w-full px-10 justify-between items-center">
        <div class="flex-none lg:hidden">
          <label for="drawer" aria-label="open sidebar" class="btn">
            <Icon icon="menu" :size="30" />
          </label>
        </div>

        <div class="hidden flex-none justify-between items-center lg:flex">
          <Icon icon="book_marked" :size="30" />

          <ul class="menu menu-horizontal">
            <li><a>Navbar Item 1</a></li>
            <li><a>Navbar Item 2</a></li>
          </ul>
        </div>

        <ul class="menu menu-horizontal gap-2">
          <li>
            <button class="rounded-xl p-2">
              <Icon icon="circle_question" :size="22" />
            </button>
          </li>
          <li>
            <button class="rounded-xl p-2">
              <Icon icon="palette" :size="22" />
            </button>
          </li>
          <li>
            <button class="rounded-full p-2 bg-base-100">
              <Icon icon="user" :size="22" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="drawer-side">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 min-h-full w-80 p-4">
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>

  <div class="drawer">
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col">
      <!-- Header horizontal -->
      <header class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6">
        <!-- Ícone à esquerda - Documento com caneta -->
        <div class="flex-none">
          <button class="btn btn-ghost btn-sm lg:btn-md">
            <Icon icon="edit" class="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>

        <!-- Menu de navegação central - visível apenas em telas grandes -->
        <nav class="hidden flex-1 justify-center lg:flex">
          <div class="flex gap-2">
            <NuxtLink v-for="item in menuItems" :key="item.href" :to="item.href" :class="'btn btn-ghost btn-sm gap-2'"
              active-class="menu-active">
              <Icon :icon="item.icon" class="h-5 w-5" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Ícones à direita -->
        <div class="flex flex-none items-center gap-2">
          <!-- Ajuda -->
          <button class="btn btn-ghost btn-circle btn-sm lg:btn-md">
            <Icon icon="help" class="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          <!-- Paleta (Tema) -->
          <button class="btn btn-ghost btn-circle btn-sm lg:btn-md">
            <Icon icon="palette" class="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          <!-- Menu Hambúrguer - visível apenas em telas pequenas -->
          <label for="drawer-toggle" class="btn btn-ghost btn-circle btn-sm lg:btn-md lg:hidden" @click="toggleDrawer">
            <Icon icon="menu" class="h-5 w-5 lg:h-6 lg:w-6" />
          </label>

          <!-- Perfil do usuário -->
          <button class="btn btn-ghost btn-circle btn-sm lg:btn-md">
            <div class="avatar placeholder">
              <div class="bg-base-300 text-base-content rounded-full w-8 h-8 lg:w-10 lg:h-10">
                <Icon icon="user" class="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </div>
          </button>
        </div>
      </header>
    </div>

    <!-- Drawer lateral - menu mobile -->
    <div class="drawer-side z-50">
      <label for="drawer-toggle" class="drawer-overlay" @click="closeDrawer" />
      <aside class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Menu</h2>
        </div>
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.href">
            <NuxtLink :to="item.href" :class="[
              'btn btn-ghost w-full justify-start gap-3',
              activeMenu === item.label ? 'bg-base-300' : ''
            ]" @click="handleMenuClick(item.label)">
              <Icon :icon="item.icon" class="h-5 w-5" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
