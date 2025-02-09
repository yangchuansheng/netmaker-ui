import React from 'react'
import { useDispatch } from 'react-redux'
import { NmLink } from '../../../components'
import { Network } from '../../../store/modules/network'
import { datePickerConverter } from '../../../util/unixTime'
import { NmTable, TableColumns } from '../../../components/Table'
import { Autorenew, Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  deleteNetwork,
  refreshPublicKeys,
} from '../../../store/modules/network/actions'
import CustomDialog from '~components/dialog/CustomDialog'

const columns: TableColumns<Network> = [
  {
    id: 'netid',
    label: 'NetId',
    minWidth: 170,
    sortable: true,
    format: (value) => <NmLink sx={{textTransform: 'none'}} to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: 'displayname',
    labelKey: 'network.displayname',
    minWidth: 100,
    sortable: true,
  },
  {
    id: 'addressrange',
    labelKey: 'network.addressrange',
    minWidth: 150,
    sortable: true,
  },
  {
    id: 'networklastmodified',
    labelKey: 'network.networklastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  },
  {
    id: 'nodeslastmodified',
    labelKey: 'network.nodeslastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  },
]

export const NetworkTable: React.FC<{networks: Network[]}> = ({networks}) => {
  // const networks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [selectedNet, setSelectedNet] = React.useState('')
  const [refresh, setRefresh] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (selected: string, toRefresh: boolean) => {
    setSelectedNet(selected)
    setRefresh(toRefresh)
    setOpen(true)
  }

  const handleAccept = () => {
    if (refresh) {
      handlePubKeyRefresh(selectedNet)
    } else {
      handleDeleteNetwork(selectedNet)
    }
  }

  const handleDeleteNetwork = (network: string) => {
    dispatch(
      deleteNetwork.request({
        netid: selectedNet,
      })
    )
  }

  const handlePubKeyRefresh = (network: string) => {
    dispatch(
      refreshPublicKeys.request({
        netid: network,
      })
    )
  }

  return (
    <>
      <NmTable
        columns={columns}
        rows={networks}
        getRowId={(row) => row.netid}
        actions={[
          (row) => ({
            tooltip: `${t('network.refresh')} : ${row.displayname}`,
            disabled: false,
            icon: <Autorenew />,
            onClick: () => {
              handleOpen(row.netid, true)
            },
          }),
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              handleOpen(row.netid, false)
            },
          }),
        ]}
      />
      {selectedNet && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleAccept}
          message={refresh ? t('network.refreshconfirm') : t('network.deleteconfirm')}
          title={`${refresh ? t('network.refresh') : t('common.delete')} ${selectedNet}`}
        />
      )}
    </>
  )
}
