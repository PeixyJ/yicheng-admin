import {
    LayoutDashboard,
    Users,
    UsersRound,
    Blocks,
    ListChecks,
    CreditCard,
    Package,
    Coins,
    PackageOpen,
    History,
    Wallet,
    ShoppingCart,
    UserCheck,
    Webhook,
    Megaphone,
    Tag,
    TicketPercent,
    Ticket,
    Bell,
    FileText,
    Send,
    MessageSquareText,
    ShieldCheck,
    Settings,
} from 'lucide-react'
import type {MenuConfig} from '@/types/menu'

// 懒加载页面组件
import {lazy} from 'react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UsersPage = lazy(() => import('@/pages/user-team/users'))
const TeamsPage = lazy(() => import('@/pages/user-team/teams'))
const FeaturesPage = lazy(() => import('@/pages/business/subscription/features'))
const PlansPage = lazy(() => import('@/pages/business/subscription/plans'))
const SubscriptionsPage = lazy(() => import('@/pages/business/subscription/subscriptions'))
const ResourcePacksPage = lazy(() => import('@/pages/business/subscription/resource-packs'))
const CreditPackagesPage = lazy(() => import('@/pages/business/credits/packages'))
const CreditRecordsPage = lazy(() => import('@/pages/business/credits/records'))
const PaymentOrdersPage = lazy(() => import('@/pages/business/payments/orders'))
const PaymentCustomersPage = lazy(() => import('@/pages/business/payments/customers'))
const WebhooksPage = lazy(() => import('@/pages/business/payments/webhooks'))
const PromoCodesPage = lazy(() => import('@/pages/operations/marketing/promo-codes'))
const CouponTemplatesPage = lazy(() => import('@/pages/operations/marketing/coupon-templates'))
const CouponsPage = lazy(() => import('@/pages/operations/marketing/coupons'))
const NotificationTemplatesPage = lazy(() => import('@/pages/operations/notifications/templates'))
const NotificationRecordsPage = lazy(() => import('@/pages/operations/notifications/records'))

/**
 * 菜单配置
 * 按业务优先级排序：
 * 1. 仪表盘 - 首页概览
 * 2. 用户管理 - 核心用户数据
 * 3. 团队管理 - 用户组织管理
 * 4. 订阅管理 - 商业模式核心
 * 5. 点数管理 - 资源/配额管理
 * 6. 支付管理 - 财务交易
 * 7. 营销管理 - 业务增长
 * 8. 通知管理 - 系统运营
 * 9. 反馈管理 - 用户反馈收集
 * 10. 管理员管理 - 系统后台管理
 * 11. 系统设置 - 系统配置
 */
export const menuConfig: MenuConfig = {
    groups: [
        {
            id: 'main',
            label: '主菜单',
            items: [
                {
                    id: 'dashboard',
                    title: '仪表盘',
                    path: '/dashboard',
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            id: 'user-management',
            label: '用户与团队',
            items: [
                {
                    id: 'users',
                    title: '用户管理',
                    path: '/dashboard/users',
                    icon: Users,
                    element: <UsersPage/>,
                },
                {
                    id: 'teams',
                    title: '团队管理',
                    path: '/dashboard/teams',
                    icon: UsersRound,
                    element: <TeamsPage/>,
                },
            ],
        },
        {
            id: 'business',
            label: '业务管理',
            items: [
                {
                    id: 'subscription',
                    title: '订阅管理',
                    path: '',
                    icon: CreditCard,
                    children: [{
                        id: 'features',
                        title: '功能管理',
                        path: '/dashboard/features',
                        icon: Blocks,
                        element: <FeaturesPage/>,
                    },
                        {
                            id: 'plans',
                            title: '订阅计划管理',
                            path: '/dashboard/plans',
                            icon: ListChecks,
                            element: <PlansPage/>,
                        },
                        {
                            id: 'subscriptions',
                            title: '订阅管理',
                            path: '/dashboard/subscriptions',
                            icon: CreditCard,
                            element: <SubscriptionsPage/>,
                        },
                        {
                            id: 'resource-packs',
                            title: '订阅资源包管理',
                            path: '/dashboard/resource-packs',
                            icon: Package,
                            element: <ResourcePacksPage/>,
                        },]
                },
                {
                    id: 'credits',
                    title: '点数管理',
                    path: '',
                    icon: Coins,
                    children: [
                        {
                            id: 'credit-records',
                            title: '点数管理',
                            path: '/dashboard/credit-records',
                            icon: History,
                            element: <CreditRecordsPage/>,
                        },
                        {
                            id: 'credit-packages',
                            title: '点数套餐管理',
                            path: '/dashboard/credit-packages',
                            icon: PackageOpen,
                            element: <CreditPackagesPage/>,
                        },
                    ],
                },
                {
                    id: 'payments',
                    title: '支付管理',
                    path: '',
                    icon: Wallet,
                    children: [
                        {
                            id: 'payment-orders',
                            title: '订单管理',
                            path: '/dashboard/payment-orders',
                            icon: ShoppingCart,
                            element: <PaymentOrdersPage/>,
                        },
                        {
                            id: 'payment-customers',
                            title: '客户管理',
                            path: '/dashboard/payment-customers',
                            icon: UserCheck,
                            element: <PaymentCustomersPage/>,
                        },
                        {
                            id: 'webhooks',
                            title: 'Webhook事件管理',
                            path: '/dashboard/webhooks',
                            icon: Webhook,
                            element: <WebhooksPage/>,
                        },
                    ],
                },
            ],
        },
        {
            id: 'operations',
            label: '运营管理',
            items: [
                {
                    id: 'marketing',
                    title: '营销管理',
                    path: '',
                    icon: Megaphone,
                    children: [
                        {
                            id: 'promo-codes',
                            title: '优惠码管理',
                            path: '/dashboard/promo-codes',
                            icon: Tag,
                            element: <PromoCodesPage/>,
                        },
                        {
                            id: 'coupon-templates',
                            title: '优惠券模板管理',
                            path: '/dashboard/coupon-templates',
                            icon: TicketPercent,
                            element: <CouponTemplatesPage/>,
                        },
                        {
                            id: 'coupons',
                            title: '优惠券管理',
                            path: '/dashboard/coupons',
                            icon: Ticket,
                            element: <CouponsPage/>,
                        },
                    ],
                },
                {
                    id: 'notifications',
                    title: '通知管理',
                    path: '',
                    icon: Bell,
                    children: [
                        {
                            id: 'notification-templates',
                            title: '通知模板管理',
                            path: '/dashboard/notification-templates',
                            icon: FileText,
                            element: <NotificationTemplatesPage/>,
                        },
                        {
                            id: 'notification-records',
                            title: '通知管理',
                            path: '/dashboard/notification-records',
                            icon: Send,
                            element: <NotificationRecordsPage/>,
                        },
                    ],
                },
                {
                    id: 'feedback',
                    title: '反馈管理',
                    path: '/dashboard/feedback',
                    icon: MessageSquareText,
                },
            ],
        },
        {
            id: 'system',
            label: '系统管理',
            items: [
                {
                    id: 'admins',
                    title: '管理员管理',
                    path: '/dashboard/admins',
                    icon: ShieldCheck,
                },
                {
                    id: 'settings',
                    title: '系统设置',
                    path: '/dashboard/settings',
                    icon: Settings,
                },
            ],
        },
    ],
}

// Dashboard 首页配置（不在菜单中显示）
export const dashboardIndex = {
    id: 'dashboard-home',
    title: 'Dashboard',
    path: '/dashboard',
    index: true,
    element: <DashboardPage/>,
    hidden: true,
}
