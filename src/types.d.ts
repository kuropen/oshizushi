// Copyright (C) 2025 Kuropen.
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE.txt or copy at
// https://www.boost.org/LICENSE_1_0.txt)

export type Bindings = {
    PO_API_TOKEN: string;
    PO_USER_KEY: string;
}

/**
 * Pushover Payload
 * @see https://pushover.net/api
 */
export type PushoverPayload = {
    token: string;
    user: string;
    message: string;
    device?: string;
    title?: string;
    attachment_base64?: string;
    attachment_type?: string;
    url?: string;
    url_title?: string;
    priority?: '-2' | '-1' | '0' | '1' | '2';
    sound?: string;
} & (
    {
        monospace?: '1';
    } | {
        html?: '1';
    }
)

export interface PushoverResponse {
    status: number;
    request: string;
    errors?: string[];
    receipt?: string;
}

/**
 * Mackerel Webhook Payload
 * @see https://mackerel.io/ja/docs/entry/howto/alerts/webhook
 */
export interface WebhookPayload {
    orgName?: string;
    event: 'alert' | 'sample' | 'hostStatus';
    imageUrl: string | null;
    memo?: string;
    type?: 'host' | 'connectivity' | 'service' | 'external' | 'check' | 'expression' | 'anomalyDetection';
    message?: string;
    host?: HostInfo;
    service?: ServiceInfo;
    alert?: AlertInfo;
    user?: UserInfo;
    fromStatus?: HostStatus;
}

interface UserInfo {
    id: string;
    screenName: string;
}

type HostStatus = 'working' | 'standby' | 'poweroff' | 'maintenance'

interface HostInfo {
    id: string;
    name: string;
    url: string;
    type: string;
    status: HostStatus;
    memo: string;
    isRetired: boolean;
    roles?: RoleInfo[];
}

interface RoleInfo {
    fullname: string;
    serviceName: string;
    serviceUrl: string;
    roleName: string;
    roleUrl: string;
}

interface ServiceInfo {
    id: string;
    memo: string;
    name: string;
    orgId: string;
    roles?: RoleInfo[];
}

interface AlertInfo {
    id: string;
    status: 'ok' | 'warning' | 'critical' | 'unknown';
    isOpen: boolean;
    trigger: 'monitoring' | 'manual' | 'monitorDelete' | 'hostRetire';
    url: string;
    openedAt: number;
    closedAt?: number;
    createdAt?: number;
    monitorName: string;
    metricLabel?: string;
    metricValue?: number;
    criticalThreshold?: number;
    warningThreshold?: number;
    monitorOperator?: '>' | '<';
    duration?: number;
    labels?: Record<string, string>;
}
