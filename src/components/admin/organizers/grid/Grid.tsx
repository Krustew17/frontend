import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import GridActions from 'components/admin/GridActions'
import theme from 'common/theme'
import DeleteModal from './DeleteModal'
import DetailsModal from './DetailsModal'
import { ModalStore } from '../OrganizerPage'
import { useOrganizersList } from 'common/hooks/organizer'
import { OrganizerResponse } from 'gql/organizer'

export default observer(function Grid() {
  const { t } = useTranslation()

  const { data }: UseQueryResult<OrganizerResponse[]> = useOrganizersList()

  const { isDetailsOpen } = ModalStore
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  })

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      headerName: t('organizer:admin.fields.actions'),
      width: 150,
      align: 'center',
      renderCell: (params: GridRenderCellParams): React.ReactNode => {
        return <GridActions modalStore={ModalStore} id={params.row.id} name={params.row.id} />
      },
    },
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: t('organizer:admin.fields.name'),
      editable: false,
      width: 400,
      valueGetter: (f) => {
        return f.row.person.company
          ? f.row.person.company.companyName
          : `${f.row.person.firstName} ${f.row.person.lastName}`
      },
    },
    {
      field: 'email',
      headerName: t('organizer:admin.fields.email'),
      editable: false,
      width: 400,
      valueGetter: (f) => f.row.person.email,
    },
    {
      field: 'phone',
      headerName: t('organizer:admin.fields.phone'),
      editable: false,
      width: 200,
      valueGetter: (f) => f.row.person.phone,
    },
    {
      field: 'createdAt',
      headerName: t('organizer:admin.fields.createdAt'),
      editable: false,
      width: 200,
      valueGetter: (f) => f.row.createdAt?.toString().slice(0, 10),
    },
  ]

  return (
    <>
      <Box>
        <DataGrid
          style={{
            background: theme.palette.common.white,
            position: 'absolute',
            height: 'calc(100vh - 300px)',
            border: 'none',
            width: 'calc(100% - 48px)',
            left: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRadius: '0 0 13px 13px',
          }}
          rows={data || []}
          columns={columns}
          columnVisibilityModel={{
            id: false,
          }}
          pageSizeOptions={[5, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          autoHeight
          disableRowSelectionOnClick
        />
      </Box>

      {/* making sure we don't sent requests to the API when not needed */}
      {isDetailsOpen && <DetailsModal />}
      <DeleteModal />
    </>
  )
})
