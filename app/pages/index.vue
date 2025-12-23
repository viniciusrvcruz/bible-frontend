<script setup lang="ts">

</script>

<template>
  <Splitter style="height: 100vh">
    <SplitterPanel class="items-center justify-center hidden md:flex" :min-size="20"> Panel 1 </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center" :min-size="10"> Panel 2 </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center absolute bottom-0 left-0 right-0 bg-red-400 z-10" :min-size="10"> Panel 3 </SplitterPanel>
  </Splitter>
</template>