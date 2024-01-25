/* ==============================================================================
OKAS_SaveChangeTint.js
SNS： https://tm-misfit.hateblo.jp
=================================================================================
更新履歴：
2024/01/25 Ver.1.1.0  色調の復元・予約実行時にウェイトを指定可能に。文言等の修正。利用規約の微改定。
2022/08/08 Ver.1.0.0  初版
*/
/*:
 * @plugindesc 色調の保存、復元、予約
 * @author Okiashi
 * @target MZ
 * @url https://raw.githubusercontent.com/okiashi/RPGMakerMZ/main/OKAS_SaveChangeTint.js
 * @help OKAS_SaveChangeTint.js (2024/01/25 Ver.1.1.0)
 *
 * 概要：
 * プラグインコマンドで色調の保存、復元、予約が行えます。
 * 「一時的に色調を変更し、ワンコマンドで元に戻したい」
 * 「色調のデフォルト設定のようなものを設けたい」 etc...
 *
 * プラグインコマンド：
 * 　[パラメータ変数1]
 * 　 1.現在の色調を保存 & 変更
 * 　 2.現在の色調を保存(保存のみ)
 * 　 3.色調の復元
 * 　[パラメータ変数2]
 * 　 4.色調の予約(予約のみ)
 *  　5.色調の予約を反映
 *
 * メモ：
 * - 「イベントコマンド」や「スクリプト」で色調の変更をした分は
 *   復元ができませんのでご注意ください。
 *   復元させたい色調は、当プラグインコマンド経由で変更を行って下さい。
 * - 使い方の例
 *   https://tm-misfit.hateblo.jp/entry/2022/08/08/061330
 *
 * ----------------------------------------------------------------------------
 * 利用規約：
 * OK - 改変、プラグイン単体の再配布(無料)
 *      サポート対応できないため、ご自由に改変下さい。クレジット不要です。
 *      ご利用は自己責任でお願いいたします。
 * NG - プラグイン単体の有料販売(丸ごと転載し販売などトラブルを招く行為)
 * ----------------------------------------------------------------------------
 *
 @ -------------------------- パラメータ
 * @param Save Tint Variable
 * @text [変数1] 現在の色調を保存
 * @desc 現在の色調情報を格納する変数です。
 * 指定がない場合は、変数1がセットされます。
 * @type variable
 * @default 1
 *
 * @param Set Tint Variable
 * @text [変数2] 色調の予約
 * @desc 予約色調を格納する変数です。
 * 指定がない場合は、変数2がセットされます。
 * @type variable
 * @default 2
 *
 @ -------------------------- プラグインコマンド
 * @command SaveChangeTint
 * @text 現在の色調を保存し、変更
 * @desc 現在の色調を保存してから変更します。
 *
 * @arg Red
 * @text 赤(-255～255)
 * @type string
 * @desc 赤(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Green
 * @text 緑(-255～255)
 * @type string
 * @desc 緑(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Blue
 * @text 青(-255～255)
 * @type string
 * @desc 青(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Gray
 * @text グレー(0～255)
 * @type string
 * @desc グレー(0～255：高いほど彩度なし)
 * @default 0
 *
 * @arg Wait
 * @text ウェイト時間(フレーム)
 * @type string
 * @desc ウェイト時間(フレーム：1/60秒)
 * @default 60
 *
 @ --------------------------
 * @command SaveTint
 * @text 現在の色調を保存(保存のみ)
 * @desc 現在の色調を保存します。
 *
 @ --------------------------
 * @command RestorationTint
 * @text 色調を復元
 * @desc 色調を保存していた内容に戻します。
 *
 * @arg Wait
 * @text ウェイト時間(フレーム)
 * @type string
 * @desc ウェイト時間(フレーム:1/60秒)
 * @default 60
 @ --------------------------
 * @command SetTint
 * @text 色調を予約
 * @desc 色調を予約保存します。
 * お好きなタイミングで「予約を反映」を実行して下さい。
 *
 * @arg Red
 * @text 赤(-255～255)
 * @type string
 * @desc 赤(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Green
 * @text 緑(-255～255)
 * @type string
 * @desc 緑(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Blue
 * @text 青(-255～255)
 * @type string
 * @desc 青(-255～255：マイナスほど暗くなる)
 * @default 0
 *
 * @arg Gray
 * @text グレー(0～255)
 * @type string
 * @desc グレー(0～255：高いほど彩度なし)
 * @default 0
 *
 * @arg Wait
 * @text ウェイト時間(フレーム)
 * @type string
 * @desc ウェイト時間(フレーム：1/60秒)
 * @default 60
 *
 @ --------------------------
 * @command RestorationSetTint
 * @text 色調の予約を反映
 * @desc 色調を予約した内容に変更します。
 * 
 * @arg Wait
 * @text ウェイト時間(フレーム)
 * @type string
 * @desc ウェイト時間(フレーム:1/60秒)
 * @default 60
 *
 */
// ----------------------------------------------------------------------------
// 全体を関数で囲む
(() => {
    'use strict';
    // プラグインパラメーターを変数にして取り込む
    const pluginName = 'OKAS_SaveChangeTint';
    const parameters = PluginManager.parameters(pluginName);
    // ローカル変数の設定　(*このプラグイン内でのみ有効な変数)
    const SaveTV = parseInt(parameters['Save Tint Variable']) || 1;
    const SetTV = parseInt(parameters['Set Tint Variable']) || 2;

    // =============================================================================
    // プラグインコマンド
    // =============================================================================

    // 現在の色調を保存&変更
    PluginManager.registerCommand(pluginName, "SaveChangeTint", function (args) {
        Game_Map.prototype.saveTint();
        const p = {};
        p.red = Number(args.Red) || 0;
        p.green = Number(args.Green) || 0;
        p.blue = Number(args.Blue) || 0;
        p.gray = Number(args.Gray) || 0;
        p.wait = Number(args.Wait) || 60;
        $gameScreen.startTint([p.red, p.green, p.blue, p.gray], p.wait);
    });

    // 現在の色調を保存　save
    PluginManager.registerCommand(pluginName, "SaveTint", function () {
        Game_Map.prototype.saveTint();
    });

    // 色調の復元
    PluginManager.registerCommand(pluginName, "RestorationTint", function (args) {
        const v = $gameVariables.value(SaveTV);
        const wait = Number(args.Wait) || 60;
        $gameScreen.startTint([v[0], v[1], v[2], v[3]], wait);
    });

    // 色調の予約 set
    PluginManager.registerCommand(pluginName, "SetTint", function (args) {
        const p = {};
        p.red = Number(args.Red) || 0;
        p.green = Number(args.Green) || 0;
        p.blue = Number(args.Blue) || 0;
        p.gray = Number(args.Gray) || 0;
        p.wait = Number(args.Wait) || 60;
        $gameVariables._data[SetTV] = [p.red, p.green, p.blue, p.gray, p.wait];
    });

    // 色調の予約を反映
    PluginManager.registerCommand(pluginName, "RestorationSetTint", function (args) {
        const v = $gameVariables.value(SetTV);
        const wait = Number(args.Wait) || 60;
        $gameScreen.startTint([v[0], v[1], v[2], v[3]], wait);
    });

    // ------------------------------------------------------------------------------
    // saveTint()
    // ------------------------------------------------------------------------------
    Game_Map.prototype.saveTint = function () {
        $gameVariables._data[SaveTV] = [$gameScreen._tone[0], $gameScreen._tone[1], $gameScreen._tone[2], $gameScreen._tone[3], 60];
    };


})();
