import {getRemoteConfig} from "firebase-admin/remote-config";

export const getHumidityThreshold = async (): Promise<number|null> => {
  const remoteConfig = getRemoteConfig();
  const template = await remoteConfig.getTemplate();
  const humidityThresholdParameter = template.parameters["humidityThreshold"];

  if (humidityThresholdParameter.defaultValue && "value" in humidityThresholdParameter.defaultValue) {
    return parseFloat(humidityThresholdParameter.defaultValue.value);
  } else {
    return null;
  }
};
