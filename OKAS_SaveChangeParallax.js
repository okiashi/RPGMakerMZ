//=================================================================================
// OKAS_SaveChangeParallax.js
// 2022/08/08 Ver.1.2.0
// twitter : https://twitter.com/misfit_okiashi
//=================================================================================
/*:
 * @plugindesc 遠景の保存、復元、予約
 * @target MZ
 * @url https://github.com/okiashi/RPGMakerMZ/blob/main/OKAS_SaveChangeParallax.js
 * @author Okiashi
 * @help OKAS_SaveChangeParallax.js
 *
 * 概要：
 * プラグインコマンドで遠景の保存、復元、予約が行えます。
 * ループやスクロールの設定も含まれます。
 * 「一時的に遠景を変更し、ワンコマンドで元に戻したい」
 * 「遠景のデフォルト設定のようなものを設けたい」
 * 「遠景の変更を使った汎用的なイベントを組みたい」 etc...
 *
 * プラグインコマンド：
 * 　[パラメータ変数1]
 * 　 1.現在の遠景を保存 & 変更
 * 　 2.現在の遠景を保存(保存のみ)
 * 　 3.遠景の復元
 * 　[パラメータ変数2]
 * 　 4.遠景の予約(予約のみ)
 *  　5.遠景の予約を反映
 *
 * メモ：
 * - 「イベントコマンド」や「スクリプト」で遠景の変更をした分は
 *   復元ができませんのでご注意ください。
 *   復元させたい遠景は、当プラグインコマンド経由で変更を行って下さい。
 * - 「遠景なし」の復元を許可
 *   true:  元の遠景が「なし」でも、「なし」の状態に復元します。
 *   false: 元の遠景が「なし」の時、何もせず終了します。
 * - 使い方の例
 *   https://tm-misfit.hateblo.jp/entry/2022/08/08/034137
 *
 * ----------------------------------------------------------------------------
 * 利用規約：
 * OK - 改変、再配布(無料)
 *      クレジット不要です。サポート対応できないため、ご自由に改変下さい。
 * NG - 有償再配布(問題を避けるため)
 * ----------------------------------------------------------------------------
 * 更新履歴：
 * 2022/08/08 Ver.1.2.0　遠景の予約機能を追加
 * 2022/08/03 Ver.1.0.0　初版
 * ----------------------------------------------------------------------------
 *
 @ -------------------------- パラメータ
 * @param Save Parallax Variable
 * @text [変数1] 現在の遠景を保存
 * @desc 現在の遠景情報を格納する変数です。
 * 指定がない場合は、変数1がセットされます。
 * @type variable
 * @default 1
 *
 * @param Set Parallax Variable
 * @text [変数2] 遠景の予約
 * @desc 遠景情報を格納する変数です。
 * 指定がない場合は、変数2がセットされます。
 * @type variable
 * @default 2
 *
 * @param Reset Permission
 * @text 遠景「なし」の復元をするか
 * @desc true: 元の遠景がなしの時も復元を行います。(default)
 * false: 元の遠景がなしの時、復元を行いません。
 * @type boolean
 * @default true
 *
 @ -------------------------- プラグインコマンド
 * @command SaveChangeParallax
 * @text 現在の遠景を変更&保存
 * @desc 現在の遠景を保存してから変更します。
 * スクロールなどの設定も保存されます。
 *
 * @arg Image
 * @text 遠景ピクチャ
 * @type file
 * @dir img/parallaxes/
 * @desc 遠景をこのピクチャに変更します。
 * @default
 *
 * @arg LoopX
 * @text ループX
 * @type boolean
 * @desc 横方向にループしますか？
 * @default false
 *
 * @arg LoopY
 * @text ループY
 * @type boolean
 * @desc 縦方向にループしますか？
 * @default false
 *
 * @arg Sx
 * @text X方向のスクロール速度
 * @type string
 * @desc 横方向のスクロール速度。(負の数で右)
 * @default 0
 *
 * @arg Sy
 * @text Y方向のスクロール速度
 * @type string
 * @desc 縦方向のスクロール速度。(負の数で下)
 * @default 0
 *
 @ -------------------------- プラグインコマンド
 * @command SaveParallax
 * @text 現在の遠景を保存(保存のみ)
 * @desc このマップの遠景を保存します。
 * スクロールなどの設定も保存します。
 *
 @ -------------------------- プラグインコマンド
 * @command RestorationParallax
 * @text 遠景を復元
 * @desc 遠景を変更前に戻します。
 * スクロールなどの設定も復元されます。
 *
 @ -------------------------- プラグインコマンド
 * @command SetParallax
 * @text 遠景を予約
 * @desc 遠景情報を予約保存します。
 * お好きなタイミングで「予約を反映」を実行して下さい。
 *
 * @arg Image
 * @text 予約遠景ピクチャ
 * @type file
 * @dir img/parallaxes/
 * @desc 遠景をこのピクチャに変更します。
 * @default
 *
 * @arg LoopX
 * @text ループX
 * @type boolean
 * @desc 横方向にループしますか？
 * @default false
 *
 * @arg LoopY
 * @text ループY
 * @type boolean
 * @desc 縦方向にループしますか？
 * @default false
 *
 * @arg Sx
 * @text X方向のスクロール速度
 * @type string
 * @desc 横方向のスクロール速度。(負の数で右)
 * @default 0
 *
 * @arg Sy
 * @text Y方向のスクロール速度
 * @type string
 * @desc 縦方向のスクロール速度。(負の数で下)
 * @default 0
 *
 @ -------------------------- プラグインコマンド
 * @command RestorationSetParallax
 * @text 遠景の予約を反映
 * @desc 遠景を予約した内容に変更します。
 * スクロールなどの設定も反映されます。
 *
 */
// ----------------------------------------------------------------------------
//　全体を関数で囲む
(() => {
    'use strict';
//　プラグインパラメーターを変数にして取り込む
const pluginName = 'OKAS_SaveChangeParallax';
const parameters = PluginManager.parameters(pluginName);
// Boolean変換
function parseStrToBoolean(str) {
    return (str == 'true') ? true : false;
}
//　ローカル変数の設定　(*このプラグイン内でのみ有効な変数)
const SavePV = parseInt(parameters['Save Parallax Variable']) || 1;
const SetPV = parseInt(parameters['Set Parallax Variable']) || 2;
const ReOK = String(parameters['Reset Permission']) === 'true';

// =============================================================================
// プラグインコマンド  現在の遠景を保存&変更
// =============================================================================
PluginManager.registerCommand(pluginName, "SaveChangeParallax", function(args) {
    Game_Map.prototype.saveParallax();
    const p = {};
    p.pict = String(args.Image, "");
    p.LoopX = parseStrToBoolean(args.LoopX, false);
    p.LoopY = parseStrToBoolean(args.LoopY, false);
    p.Sx = Number(args.Sx, 0);
    p.Sy = Number(args.Sy, 0);
    $gameMap.changeParallax(p.pict,p.LoopX,p.LoopY,p.Sx,p.Sy);
});

// =============================================================================
// プラグインコマンド  現在の遠景を保存　save
// =============================================================================
PluginManager.registerCommand(pluginName, "SaveParallax", function() {
    Game_Map.prototype.saveParallax();
});

// =============================================================================
// プラグインコマンド  遠景の復元
// =============================================================================
PluginManager.registerCommand(pluginName, "RestorationParallax", function() {
    const v = $gameVariables.value(SavePV);
    if (v[0] || v[0] == "" && ReOK) {
      $gameMap.changeParallax(v[0],v[1],v[2],v[3],v[4]);
    }
    else {
      // undefined , null , 空文字 , false , 0
    }
});

// =============================================================================
// プラグインコマンド  遠景の予約 set
// =============================================================================
PluginManager.registerCommand(pluginName, "SetParallax", function(args) {
    const p = {};
    p.pict = String(args.Image, "");
    p.LoopX = parseStrToBoolean(args.LoopX, false);
    p.LoopY = parseStrToBoolean(args.LoopY, false);
    p.Sx = Number(args.Sx, 0);
    p.Sy = Number(args.Sy, 0);
    $gameVariables._data[SetPV] = [p.pict,p.LoopX,p.LoopY,p.Sx,p.Sy];
});

// =============================================================================
// プラグインコマンド  遠景の予約を反映
// =============================================================================
PluginManager.registerCommand(pluginName, "RestorationSetParallax", function() {
    const v = $gameVariables.value(SetPV);
    if (v[0] || v[0] == "" && ReOK) {
      $gameMap.changeParallax(v[0],v[1],v[2],v[3],v[4]);
    }
    else {
      // undefined , null , 空文字 , false , 0
    }
});

// ------------------------------------------------------------------------------
// saveParallax()
// ------------------------------------------------------------------------------
Game_Map.prototype.saveParallax = function() {
    $gameVariables._data[SavePV] =
    [$gameMap._parallaxName, $gameMap._parallaxLoopX, $gameMap._parallaxLoopY, $gameMap._parallaxSx, $gameMap._parallaxSy];
};


})();
