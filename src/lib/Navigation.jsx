import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineArrowCircleLeft,
    HiOutlineExclamationCircle,
    HiOutlineSwitchHorizontal
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'products',
        label: 'Produkte',
        path: '/products',
        icon: <HiOutlineCube />
    },
    {
        key: 'sales',
        label: 'Verkäufe',
        path: '/sales',
        icon: <HiOutlineShoppingCart />
    },
    {
        key: 'purchase',
        label: 'Wareneinkäufe',
        path: '/purchase',
        icon: <HiOutlineShoppingBag />
    },
    {
        key: 'inventory',
        label: 'Bestandsbewegung',
        path: '/inventory',
        icon: <HiOutlineSwitchHorizontal />
    },
    {
        key: 'goodsreceipt',
        label: 'Wareneingang',
        path: '/goodsreceipt',
        icon: <HiOutlineClipboardList />
    },
    {
        key: 'return',
        label: 'Rückgabe',
        path: '/return',
        icon: <HiOutlineArrowCircleLeft />
    },
    {
        key: 'complaints',
        label: 'Reklamation',
        path: '/complaints',
        icon: <HiOutlineExclamationCircle />
    }
]
