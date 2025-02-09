import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NetworkCard from '~components/dashboard/NetworkCard'
import NodeCard from '~components/dashboard/NodeCard'
import ExtClientsCard from '~components/dashboard/ExtClientsCard'
import AccessKeysCard from '~components/dashboard/AccessKeyCard'
import DNSCard from '~components/dashboard/DNSCard'
import UserCard from '~components/dashboard/UserCard'
import { useSelector } from 'react-redux'
import { authSelectors } from '~store/types'

export const Dashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const user = useSelector(authSelectors.getUser)

  useLinkBreadcrumb({
    title: t('breadcrumbs.dashboard'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={5}>
              <NetworkCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <NodeCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <AccessKeysCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ExtClientsCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <DNSCard />
            </Grid>
            {user?.isAdmin && (
              <Grid item xs={12} sm={6} md={5}>
                <UserCard />
              </Grid>
            )}
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
