import { Family, InsertOrUpdateFamilyForm } from './model/familyModel';
import { BasicColumn } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';

export const fmColumns: BasicColumn[] = [
  {
    dataIndex: 'fmName',
    title: '姓名',
    editRow: true,
    editRule: true,
    editComponent: 'Input',
  },
  {
    dataIndex: 'fmRelation',
    title: '与本人关系',
    editRow: true,
    editRule: true,
    editComponent: 'Input',
  },
  {
    dataIndex: 'fmCompany',
    title: '工作单位',
    editRow: true,
    editRule: true,
    editComponent: 'Input',
  },
  {
    dataIndex: 'fmPosition',
    title: '职务',
    editRow: true,
    editRule: true,
    editComponent: 'Input',
  },
];

enum Api {
  Base = '/api/fm',
}

export function listFamilies(fmCandId: number) {
  return defHttp.get<Family[]>({ url: Api.Base, params: { fmCandId } });
}

export function delFamily(fmId: number) {
  return defHttp.delete<boolean>({ url: `${Api.Base}/${fmId}` });
}

export function updateFamily(data: InsertOrUpdateFamilyForm) {
  return defHttp.put<boolean>({ url: Api.Base, data });
}

export function addFamily(data: InsertOrUpdateFamilyForm) {
  return defHttp.post({ url: Api.Base, data });
}
