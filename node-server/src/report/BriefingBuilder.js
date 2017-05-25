/**
 * Created by lyc on 17-5-23.
 *
 * BriefingBuilder 构建类
 */

var Briefing = require('./Briefing.js');
var BriefingCell = require('./BriefingCell.js');
var BriefingBody = require('./BriefingBody.js');

const briefingBuilder = {
    briefing: Briefing,

    buildType: function (type) {
        this.briefing.type = type;
    },

    buildTitle: function (title) {
        this.briefing.title = title;
    },

    buildSubTitle: function (subTitle) {
        this.briefing.subTitle = subTitle;
    },

    buildAuthor: function (author) {
        this.briefing.author = author;
    },

    buildCreateTime: function (createTime) {
        this.briefing.createTime = createTime;
    },

    buildOutline: function (outline) {
        this.briefing.outline = outline;
    },

    buildIssue: function (issue) {
        this.briefing.issue = issue;
    },

    buildBriefingBody: function (briefingBody) {
        this.briefing.briefingBody = briefingBody;
    },

    buildSummary: function (summary) {
        this.briefing.summary = summary;
    },

    getBriefing: function () {
        return this.briefing;
    }
};

const briefingDirector = {
    briefingBuilder: briefingBuilder,
    createBriefing: function(briefing){
        var briefingBuilder = this.briefingBuilder;
        // 先构造简报
        briefingBuilder.buildType(briefing.type);
        briefingBuilder.buildTitle(briefing.title);
        briefingBuilder.buildSubTitle(briefing.subTitle);
        briefingBuilder.buildAuthor(briefing.author);
        briefingBuilder.buildCreateTime(briefing.createTime);
        briefingBuilder.buildOutline(briefing.outline);
        briefingBuilder.buildIssue(briefing.issue);
        briefingBuilder.buildBriefingBody(briefing.briefingBody);
        briefingBuilder.buildSummary(briefing.summary);
    }
};

const briefingCellBuilder = {
    briefingCell: BriefingCell,

    buildLevel: function (level) {
        this.briefingCell.level = level;
    },

    buildTitle: function (title) {
        this.briefingCell.title = title;
    },

    buildImageUrl: function (imageUrl) {
        this.briefingCell.imageUrl = imageUrl;
    },

    buildDescription: function (description) {
        this.briefingCell.description = description;
    },

    buildChildren: function (children) {
        this.briefingCell.children = children;
    },

    buildChartId: function (chartId) {
        this.briefingCell.chartId = chartId;
    },

    buildMethod: function (method) {
        this.briefingCell.method = method;
    },
    getBriefingCell: function () {
        return this.briefingCell;
    }
};

const briefingCellDirector = {
    briefingCellBuilder: briefingCellBuilder,
    createBriefingCell: function(briefingCell){
        var briefingCellBuilder = this.briefingCellBuilder;
        // 先构造简报元素
        briefingCellBuilder.buildLevel(briefingCell.level);
        briefingCellBuilder.buildTitle(briefingCell.title);
        briefingCellBuilder.buildImageUrl(briefingCell.imageUrl);
        briefingCellBuilder.buildDescription(briefingCell.description);
        briefingCellBuilder.buildChildren(briefingCell.children);
        briefingCellBuilder.buildChartId(briefingCell.chartId);
        briefingCellBuilder.buildMethod(briefingCell.method);
    }
};

var BriefingBodyBuilder = function () {
    var briefingBody = new BriefingBody();

    buildBriefingCells = function (briefingCells) {
        briefingBody.briefingCells = briefingCells;
    };

    getBriefingBody = function () {
        return briefingBody;
    };
};

var BriefingBodyDirector = function () {
    var briefingBodyBuilder = new BriefingBodyBuilder();
    createBriefingBody = function(briefingCells){
        // 先构造简报Title
        briefingBodyBuilder.buildBriefingCells(briefingCells);
    }
};

const builder = {
    briefingBuilder: briefingBuilder,
    briefingDirector: briefingDirector,
    briefingCellBuilder: briefingCellBuilder,
    briefingCellDirector: briefingCellDirector
    // briefingBodyBuilder: BriefingBodyBuilder(),
    // briefingBodyDirector: BriefingBodyDirector()
};
module.exports = builder;
// {BriefingBuilder, BriefingDirector, BriefingCellBuilder, BriefingCellDirector, BriefingBodyBuilder, BriefingBodyDirector};
// export {BriefingBuilder, BriefingDirector, BriefingCellBuilder, BriefingCellDirector, BriefingBodyBuilder, BriefingBodyDirector}
