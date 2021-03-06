import { Button, Dialog } from '@singularity/core'
import { useIntl } from 'react-intl'

type DeletionModalProps = {
  entity: string
  onCancel: () => void
  onConfirm: () => void
}
export function DeletionModal({ entity, onCancel, onConfirm }: DeletionModalProps) {
  const intl = useIntl()

  return (
    <Dialog>
      <Dialog.Body>
        <Dialog.Title>
          {intl.formatMessage({
            defaultMessage: 'Delete Confirmation',
            description: '[Delete Confirmation Dialog] Title.',
            id: '9vy90u',
          })}
        </Dialog.Title>

        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage(
              {
                defaultMessage: 'Are you sure you want to delete <strong>{entity}</strong>?',
                description: '[Delete Confirmation Dialog] Message.',
                id: 'oRbw/6',
              },
              {
                entity,
                strong: text => `<strong>${text}</strong>`,
              },
            ),
          }}
        />
      </Dialog.Body>

      <Dialog.Action>
        <Button accent="secondary" onClick={onCancel}>
          {intl.formatMessage({
            defaultMessage: 'Cancel',
            description: '[Delete Confirmation Dialog] Cancel button label.',
            id: 'mJMucx',
          })}
        </Button>
        <Button accent="danger" onClick={onConfirm}>
          {intl.formatMessage({
            defaultMessage: 'Delete',
            description: '[Delete Confirmation Dialog] Delete button label.',
            id: 'Ddm/Wq',
          })}
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
