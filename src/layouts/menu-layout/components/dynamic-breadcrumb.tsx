import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { menuConfig } from '@/constants/menu'
import { getBreadcrumbs } from '@/utils/menu'

export function DynamicBreadcrumb() {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(menuConfig, location.pathname)

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={item.id}>
              {index > 0 && <BreadcrumbSeparator className='hidden md:block' />}
              <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                {isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path || '/dashboard'}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
