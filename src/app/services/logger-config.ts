import { InjectionToken } from '@angular/core';

export interface LoggerConfig {
  useDatabase: boolean;
}

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('LOGGER_CONFIG');
