import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { AppConfig } from 'src/config/AppConfig';

export interface DeviceData {
    pushPermissionStatus: string;
    token: string;
    experienceId: string;
    appName: string;
    appPackageName: string;
    appVersionNumber: string;
    appVersionCode: string;
    appVersion: string;
    appVersionFigure: number;
    platform: string;
    platformVersion: string;
    model: string;
    modelName: string;
    deviceName: string;
    uuid: string; // Device Unique ID
}

export const getDeviceData = async (fcmToken: string, permissionStatus: string): Promise<DeviceData> => {
    // Map internal app type to backend app name
    const appName = AppConfig.APP_TYPE === 'bb' ? 'buddy_body' : 'spa';
    const bundleId = DeviceInfo.getBundleId();
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();

    // Format version like "v6.9.1-2025123000"
    const appVersion = `v${version}-${buildNumber}`;

    // Calculate specific version figure if needed (e.g. 6.9.1 -> 691)
    const versionParts = version.split('.');
    const major = parseInt(versionParts[0] || '0', 10);
    const minor = parseInt(versionParts[1] || '0', 10);
    const patch = parseInt(versionParts[2] || '0', 10);
    const appVersionFigure = major * 100 + minor * 10 + patch;

    const model = DeviceInfo.getModel();
    const deviceName = await DeviceInfo.getDeviceName();
    const uniqueId = await DeviceInfo.getUniqueId();

    return {
        pushPermissionStatus: permissionStatus,
        token: fcmToken,
        experienceId: AppConfig.APP_TYPE === 'bb' ? '@anonymous/bb' : '@anonymous/spa',
        appName: appName,
        appPackageName: bundleId,
        appVersionNumber: version,
        appVersionCode: buildNumber,
        appVersion: appVersion,
        appVersionFigure: appVersionFigure,
        platform: Platform.OS,
        platformVersion: String(Platform.Version),
        model: model,
        modelName: model, // DeviceInfo doesn't strictly differentiate modelName vs model like the example might imply for all platforms
        deviceName: deviceName,
        uuid: uniqueId,
    };
};
