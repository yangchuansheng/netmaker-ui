import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkAccessKeys } from './components/NetworkAccessKeys'
import { AccessKeyCreate } from './components/AccessKeyCreate'
import { AccessKeyView } from './components/AccessKeyView'
import { NetworkSelect } from '~components/NetworkSelect'

export const AccessKeys: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.accessKeys'),
  })

  const titleStyle = {
    textAlign: 'center',
  } as any

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={5}>
              <div style={titleStyle}>
                <Typography variant="h5">
                  {t('accesskey.accesskeys')}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <NetworkSelect selectAll />
        </Route>
        <Route path={`${path}/:netid/details/:keyname`}>
          <AccessKeyView />
        </Route>
        <Route path={`${path}/:netid/create`}>
          <AccessKeyCreate />
        </Route>
        <Route path={`${path}/:netid`}>
          <NetworkAccessKeys />
        </Route>
      </Switch>
    </Container>
  )
}
