import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { Protein, ProteinModification } from '../types';
import { proteinModificationService } from '../services/proteinModificationService';
import { Menu, MenuItem } from '@mui/material';
import { authService } from '../services/authService';
import { ProteinModificationForm } from './ProteinModificationForm';

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 2px solid #2196f3;
  min-width: 150px;
  cursor: pointer;
  position: relative;
  &:hover {
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  }
`;

const ProteinName = styled.div`
  font-weight: bold;
  color: #2196f3;
  text-align: center;
  margin-bottom: 5px;
`;

const ModificationContainer = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const ModificationBranch = styled.div<{ $angle: number }>`
  position: absolute;
  height: 2px;
  background-color: #90caf9;
  transform-origin: left center;
  transform: rotate(${props => props.$angle}deg);
  z-index: 1;
  pointer-events: none;
`;

const ModificationNode = styled.div<{ $angle: number; $type: string }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$type) {
      case 'Phosphorylation': return '#FF5722';
      case 'Methylation': return '#4CAF50';
      case 'Acetylation': return '#9C27B0';
      case 'Ubiquitination': return '#FFC107';
      case 'SUMOylation': return '#3F51B5';
      case 'Glycosylation': return '#795548';
      default: return '#607D8B';
    }
  }};
  cursor: pointer;
  transform: translate(-50%, -50%) rotate(${props => props.$angle}deg);
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  z-index: 2;
  pointer-events: all;
`;

const ModificationHandleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`;

interface ProteinNodeProps {
  data: Protein;
}

const ProteinNode: React.FC<ProteinNodeProps> = ({ data }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeSize, setNodeSize] = useState({ width: 0, height: 0 });
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [modifications, setModifications] = useState<ProteinModification[]>([]);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [selectedModification, setSelectedModification] = useState<ProteinModification | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.verifyToken();
      setIsAdmin(!!user);
    } catch (error) {
      setIsAdmin(false);
    }
  }, []);

  const loadModifications = useCallback(async () => {
    try {
      const mods = await proteinModificationService.getByProteinId(data._id);
      setModifications(mods);
    } catch (error) {
      console.error('Failed to load modifications:', error);
    }
  }, [data._id]);

  useLayoutEffect(() => {
    if (nodeRef.current) {
      setNodeSize({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadModifications();
  }, [checkAuth, loadModifications]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // Only show context menu for admin users
    if (!isAdmin) return;
    
    setSelectedModification(null);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleAddModification = () => {
    setSelectedModification(null);
    setShowModificationForm(true);
    handleClose();
  };

  const handleModificationClick = (event: React.MouseEvent, mod: ProteinModification) => {
    event.stopPropagation();
    // Only allow modification management for admin users
    if (!isAdmin) return;
    
    setSelectedModification(mod);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleModificationSubmit = async (formData: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedModification) {
        await proteinModificationService.update(selectedModification._id, formData);
      } else {
        await proteinModificationService.create(data._id, formData);
      }
      await loadModifications();
      setShowModificationForm(false);
    } catch (error) {
      console.error('Failed to save modification:', error);
    }
  };

  const handleDeleteModification = async (mod: ProteinModification) => {
    try {
      await proteinModificationService.delete(mod._id);
      await loadModifications();
      handleClose();
    } catch (error) {
      console.error('Failed to delete modification:', error);
    }
  };

  // 计算修饰节点的位置
  const getModificationPosition = (index: number, totalMods: number) => {
    const baseAngle = -90; // 起始角度（正上方）
    const angleSpread = 180; // 分布的角度范围
    const angle = baseAngle + (angleSpread / (totalMods + 1)) * (index + 1);
    return angle;
  };

  return (
    <NodeContainer ref={nodeRef} onContextMenu={handleContextMenu}>
      <Handle type="target" position={Position.Top} />
      <ProteinName>{data.name}</ProteinName>

      <ModificationContainer>
        {nodeSize.width > 0 && modifications.map((mod, index) => {
          const angle = getModificationPosition(index, modifications.length);
          const radians = (angle * Math.PI) / 180;
          const w2 = nodeSize.width / 2;
          const h2 = nodeSize.height / 2;
          const cos_t = Math.cos(radians);
          const sin_t = Math.sin(radians);

          let r_intersect;
          if (w2 * Math.abs(sin_t) < h2 * Math.abs(cos_t)) {
            r_intersect = w2 / Math.abs(cos_t);
          } else {
            r_intersect = h2 / Math.abs(sin_t);
          }

          const startX = r_intersect * cos_t;
          const startY = r_intersect * sin_t;

          const branchLength = 25;
          const endX = (r_intersect + branchLength) * cos_t;
          const endY = (r_intersect + branchLength) * sin_t;

          return (
            <React.Fragment key={mod._id}>
              <ModificationBranch
                $angle={angle}
                style={{
                  left: `calc(50% + ${startX}px)`,
                  top: `calc(50% + ${startY}px)`,
                  width: `${branchLength}px`
                }}
              />
              <ModificationNode
                $angle={angle}
                $type={mod.type}
                style={{
                  left: `calc(50% + ${endX}px)`,
                  top: `calc(50% + ${endY}px)`,
                }}
                onClick={(e) => handleModificationClick(e, mod)}
                title={`${mod.type} at ${mod.position}`}
              />
              <ModificationHandleContainer
                style={{
                  left: `calc(50% + ${endX}px)`,
                  top: `calc(50% + ${endY}px)`,
                }}
              >
                <Handle
                  type="source"
                  position={Position.Top}
                  id={`${mod._id}-top`}
                  style={{ top: -6, left: 0 }}
                />
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${mod._id}-right`}
                  style={{ top: 0, left: 6 }}
                />
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id={`${mod._id}-bottom`}
                  style={{ top: 6, left: 0 }}
                />
                <Handle
                  type="source"
                  position={Position.Left}
                  id={`${mod._id}-left`}
                  style={{ top: 0, left: -6 }}
                />
              </ModificationHandleContainer>
            </React.Fragment>
          );
        })}
      </ModificationContainer>

      <Handle type="source" position={Position.Bottom} />

      {isAdmin && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {selectedModification ? (
            <>
              <MenuItem onClick={() => {
                setShowModificationForm(true);
                handleClose();
              }}>
                Edit Modification
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  handleDeleteModification(selectedModification);
                }} 
                style={{ color: '#d32f2f' }}
              >
                Delete Modification
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleAddModification}>Add Modification</MenuItem>
          )}
        </Menu>
      )}

      <ProteinModificationForm
        open={showModificationForm}
        onClose={() => setShowModificationForm(false)}
        onSubmit={handleModificationSubmit}
        initialData={selectedModification || {}}
      />
    </NodeContainer>
  );
};

export default ProteinNode; 