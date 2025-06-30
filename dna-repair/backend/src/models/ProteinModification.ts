import mongoose from 'mongoose';

export interface IProteinModification {
  proteinId: mongoose.Types.ObjectId;
  type: string;  // 修饰类型，如：phosphorylation, methylation等
  position: string;  // 修饰位点，如：S123, T456等
  description?: string;
  effect?: string;  // 修饰的效果描述
  createdAt: Date;
  updatedAt: Date;
}

const proteinModificationSchema = new mongoose.Schema<IProteinModification>({
  proteinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Protein',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  description: String,
  effect: String
}, {
  timestamps: true
});

// 创建复合索引
proteinModificationSchema.index({ proteinId: 1, position: 1 }, { unique: true });

export const ProteinModification = mongoose.model<IProteinModification>('ProteinModification', proteinModificationSchema); 