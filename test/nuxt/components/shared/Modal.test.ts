import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mockComponent, mountSuspended } from '@nuxt/test-utils/runtime'
import SharedModal from '~/components/shared/Modal.vue'

mockComponent('Icon', {
  props: ['icon'],
  template: '<span />',
})

type ModalWrapper = VueWrapper<InstanceType<typeof SharedModal>>

function setupDialogSpies() {
  return {
    showModal: vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(() => {}),
    close: vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(() => {}),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

async function mountModal(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) {
  const wrapper = await mountSuspended(SharedModal, {
    props: {
      title: 'Modal',
      ...props,
    },
    slots: {
      default: '<p class="default-slot">Conteúdo</p>',
      ...slots,
    },
  })

  const dialog = wrapper.find('dialog')

  return { wrapper: wrapper as ModalWrapper, dialog }
}

function headerContainer(dialog: DOMWrapper<HTMLDialogElement>) {
  return dialog.find('h3').element.parentElement!
}

describe('SharedModal', () => {
  describe('dialog API', () => {
    it('opens the native dialog via exposed open()', async () => {
      const { showModal } = setupDialogSpies()
      const { wrapper } = await mountModal()

      wrapper.vm.open()

      expect(showModal).toHaveBeenCalledOnce()
    })

    it('closes the native dialog via exposed close()', async () => {
      const { close } = setupDialogSpies()
      const { wrapper } = await mountModal()

      wrapper.vm.close()

      expect(close).toHaveBeenCalledOnce()
    })

    it('emits close when the dialog fires a native close event', async () => {
      const { wrapper, dialog } = await mountModal()

      await dialog.trigger('close')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('backdrop behavior', () => {
    it('closes on backdrop click when closeOnBackdrop is enabled', async () => {
      const { close } = setupDialogSpies()
      const { dialog } = await mountModal({ closeOnBackdrop: true })

      await dialog.trigger('click')

      expect(close).toHaveBeenCalledOnce()
    })

    it('does not close on backdrop click when closeOnBackdrop is disabled', async () => {
      const { close } = setupDialogSpies()
      const { dialog } = await mountModal({ closeOnBackdrop: false })

      await dialog.trigger('click')

      expect(close).not.toHaveBeenCalled()
    })

    it('does not close when clicking modal content', async () => {
      const { close } = setupDialogSpies()
      const { dialog } = await mountModal()

      await dialog.find('.modal-box').trigger('click')
      await dialog.find('.default-slot').trigger('click')

      expect(close).not.toHaveBeenCalled()
    })
  })

  describe('header', () => {
    it('renders title and titleId', async () => {
      const { dialog } = await mountModal({
        title: 'Meu título',
        titleId: 'custom-id',
      })

      expect(dialog.find('#custom-id').text()).toBe('Meu título')
      expect(dialog.attributes('aria-labelledby')).toBe('custom-id')
    })

    it('generates titleId when titleId prop is omitted', async () => {
      const { dialog } = await mountModal({ title: 'Título gerado' })

      const titleId = dialog.find('h3').attributes('id')

      expect(titleId).toBeTruthy()
      expect(dialog.attributes('aria-labelledby')).toBe(titleId)
    })

    it('omits aria-labelledby when there is no header', async () => {
      const { dialog } = await mountModal({ title: undefined })

      expect(dialog.attributes('aria-labelledby')).toBeUndefined()
      expect(dialog.find('h3').exists()).toBe(false)
    })

    it('sets aria-labelledby when using a custom header slot', async () => {
      const { dialog } = await mountModal(
        { title: undefined, titleId: 'header-slot-id' },
        { header: '<div class="custom-header">Header customizado</div>' },
      )

      expect(dialog.attributes('aria-labelledby')).toBe('header-slot-id')
      expect(dialog.find('.custom-header').exists()).toBe(true)
      expect(dialog.find('h3').exists()).toBe(false)
    })

    it('renders a custom header slot instead of the title prop', async () => {
      const { dialog } = await mountModal(
        { title: 'Ignorado' },
        { header: '<div class="custom-header">Header customizado</div>' },
      )

      expect(dialog.find('.custom-header').exists()).toBe(true)
      expect(dialog.find('h3').exists()).toBe(false)
    })

    it('applies bordered header classes when headerBordered is true', async () => {
      const { dialog } = await mountModal({ headerBordered: true })

      const header = headerContainer(dialog)

      expect(header.className).toContain('pb-4')
      expect(header.className).toContain('border-b')
      expect(header.className).toContain('border-base-300')
      expect(header.className).not.toContain('mb-4')
    })

    it('applies default header spacing when headerBordered is false', async () => {
      const { dialog } = await mountModal({ headerBordered: false })

      const header = headerContainer(dialog)

      expect(header.className).toContain('mb-4')
      expect(header.className).not.toContain('border-b')
    })

    it('uses the default close aria label', async () => {
      const { dialog } = await mountModal()

      expect(dialog.find('button[aria-label="Fechar"]').exists()).toBe(true)
    })

    it('uses a custom close aria label', async () => {
      const { dialog } = await mountModal({ closeAriaLabel: 'Fechar modal' })

      expect(dialog.find('button[aria-label="Fechar modal"]').exists()).toBe(true)
    })

    it('renders a screen reader only close label', async () => {
      const { dialog } = await mountModal()

      expect(dialog.find('.sr-only').text()).toBe('Fechar')
    })

    it('closes when the header close button is clicked', async () => {
      const { close } = setupDialogSpies()
      const { dialog } = await mountModal({ closeAriaLabel: 'Fechar modal' })

      await dialog.get('button[aria-label="Fechar modal"]').trigger('click')

      expect(close).toHaveBeenCalledOnce()
    })
  })

  describe('layout', () => {
    it('renders dialog with DaisyUI modal classes', async () => {
      const { dialog } = await mountModal()

      expect(dialog.classes()).toContain('modal')
      expect(dialog.classes()).toContain('modal-bottom')
      expect(dialog.classes()).toContain('sm:modal-middle')
    })

    it('renders modal-box with shared layout classes', async () => {
      const { dialog } = await mountModal()
      const box = dialog.find('.modal-box')

      expect(box.classes()).toContain('max-w-2xl')
      expect(box.classes()).toContain('sm:rounded-lg')
      expect(box.classes()).toContain('max-sm:flex')
      expect(box.classes()).toContain('max-sm:flex-col')
    })

    it('applies p-0 to modal-box when padded is false', async () => {
      const { dialog } = await mountModal({ padded: false })

      expect(dialog.find('.modal-box').classes()).toContain('p-0')
    })

    it('keeps default padding when padded is true', async () => {
      const { dialog } = await mountModal({ padded: true })

      expect(dialog.find('.modal-box').classes()).not.toContain('p-0')
    })
  })

  describe('slots', () => {
    it('renders default slot content', async () => {
      const { dialog } = await mountModal({}, {
        default: '<p class="body-content">Corpo customizado</p>',
      })

      expect(dialog.find('.body-content').text()).toBe('Corpo customizado')
    })

    it('renders the footer slot', async () => {
      const { dialog } = await mountModal(
        {},
        { footer: '<div class="custom-footer">Rodapé</div>' },
      )

      expect(dialog.find('footer').exists()).toBe(true)
      expect(dialog.find('.custom-footer').text()).toBe('Rodapé')
    })

    it('does not render footer element without footer slot', async () => {
      const { dialog } = await mountModal()

      expect(dialog.find('footer').exists()).toBe(false)
    })
  })
})
