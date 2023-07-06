/*
 *     该副本基于koishi框架,仅用于娱乐目的。
 *     Copyright (C) 2023-present yun
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {App, Context, Dict, Schema} from 'koishi'

import Gamedig from 'gamedig'

export const name = 'gamedig'

export interface Config {
  server: Dict<String, any>
}

const keyMap = {
  "name": "名称",
  "map": "地图",
  "password": "密码",
  "raw": "附加信息",
  "version": "版本",
  "protocol": "协议",
  "max": "最大",
  "players": "玩家",
  "description": "描述",
  "text": "说明",
  "online": "在线",
  "maxplayers": "最大玩家",
  "connect": "连接",
  "ping": "延迟",
}

export const schema = Schema.dict(Schema.object({
  type: Schema.string().required(),
  host: Schema.string().required(),
  port: Schema.string(),
}).required())

export function apply(ctx: Context, config: Config) {
  ctx.command("server <server>")
    .action((_, server) => {

      const currentType = config[server].type
      const currentHost = config[server].host
      const currentPort = config[server].port

      if (currentHost != null) {

        if (currentPort == "") {
          return Gamedig.query({
            type: currentType,
            host: currentHost,
          }).then((data) => {
            return format(data.raw.vanilla)
          }).catch((error) => {
            console.log("Server is offline:" + error.toString());
            return "查询不到该服务器"
          });
        } else {
          return Gamedig.query({
            type: currentType,
            host: currentHost,
            port: currentPort,
          }).then((data) => {
            return format(data.raw.vanilla)
          }).catch((error) => {
            console.log("Server is offline:" + error.toString());
            return "查询不到该服务器"
          });
        }
      } else {
        return "无该服务器"
      }
    })
}

function format(json, prefix = "") {

  let result = ""

  for (let val in json) {
    if (json[val] instanceof Object) {
      result = result + prefix + (keyMap[val] == null ? val : val + `(${keyMap[val]})`) + ":\n"
      result = result + format(json[val], prefix = "  " + prefix)
    } else {
      result = result + prefix + (keyMap[val] == null ? val : val + `(${keyMap[val]})`) + ":" + (json[val] === "" ? "无" : json[val]) + "\n"
    }
  }

  return result

}
