/*
 * Copyright (c) 2013-2015 by appPlant UG. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */

@interface APPLocalNotificationOptions : NSObject

- (id) initWithDict:(NSDictionary*)dict;

@property (readonly, getter=id) NSString* id;
@property (readonly, getter=badgeNumber) NSInteger badgeNumber;
@property (readonly, getter=alertBody) NSString* alertBody;
@property (readonly, getter=soundName) NSString* soundName;
@property (readonly, getter=fireDate) NSDate* fireDate;
@property (readonly, getter=repeatInterval) NSCalendarUnit repeatInterval;
@property (readonly, getter=userInfo) NSDictionary* userInfo;

// If it's a repeating notification
- (BOOL) isRepeating;

@end
