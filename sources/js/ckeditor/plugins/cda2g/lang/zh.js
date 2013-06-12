CKEDITOR.plugins.setLang( 'cda2g', 'zh', {
	Add: '新增 cda2g',
	Edit: '編輯 cda2g',
	menu: {
		Edit: '編輯cda2g物件',
		Delete: '刪除cda2g物件'
	},
	title: 'cda2g物件',
	dialog: {
		id: '條列識別名稱',
		type: '選擇形態',
		section: '區段',
		path: '選取XPath路徑',
		attr: '選取屬性值',
		match: '格式化條件',
		format: '格式化輸出',
		each: '條列資料格式',
		enumeratorData: '列舉資料對應轉換',
		target: 'XML輸出目標'
	},
	errorMessage: {
		selectorType: '必須選擇資料選擇型態',
		path: '您的XPath路徑有誤',
		section: '必須選擇資料區段',
		attr: '屬性值不能在EachSelector中使用',
		MF: '格式化條件必須成對完整',
		MFE: '使用條列時不可使用格式化條件',
		notCompleted: '您尚未完成操作',
		id: '識別名稱是給EachSelector內的Selector使用的'
	},
	elements: {
		selector: 'SELECTOR',
		json: 'JSON',
		each: 'EACH',
		data: 'DATA',
		enumerator: 'ENUMERATOR',
		eachselector: 'EACHSELECTOR',
		exist: 'EXIST',
		otherwise: 'OTHERWISE',
		choose: 'CHOOSE'
	}
});
