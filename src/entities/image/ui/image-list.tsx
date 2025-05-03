import React, { useState } from 'react';
import { useImages, useImageDelete } from '@/shared/api/hooks';
import { Image } from '@/entities/image/types';
import { Link } from 'react-router-dom';
import { formatBytes } from '@/shared/lib';

// shadcn UI 컴포넌트
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const ImageList = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20
  });

  const { data, isLoading, error } = useImages(pagination.page, pagination.limit);
  const deleteImageMutation = useImageDelete();

  const handleDeleteImage = (id: string) => {
    if(confirm('이미지를 삭제하시겠습니까?')) {
      deleteImageMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/15 border border-destructive text-destructive p-4 rounded-md">
        <p className="font-medium">이미지 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // API 응답 데이터를 Entity 타입으로 변환
  const images: Image[] = data?.images.map(apiImage => ({
    id: apiImage.id,
    name: apiImage.name,
    tag: apiImage.tag,
    size: apiImage.size,
    created: apiImage.created_at,
    labels: apiImage.labels,
    repository: apiImage.repository,
    digest: apiImage.digest
  })) || [];

  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">이미지 목록</h2>
        <Button variant="outline">
          이미지 풀하기
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-muted/40 rounded-lg border border-dashed border-muted-foreground/25">
          <p className="text-muted-foreground mb-2">이미지가 없습니다.</p>
          <Button variant="outline" size="sm">새 이미지 가져오기</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {image.repository}
                    </CardTitle>
                    {image.tag && (
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {image.tag}
                        </Badge>
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {image.id.substring(0, 12)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">크기:</span>
                    <span className="font-medium">{formatBytes(image.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">생성일:</span>
                    <span className="font-medium">
                      {new Date(image.created).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="default" 
                  className="w-full" 
                  asChild
                >
                  <Link to={`/images/${image.id}`}>상세 정보</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  삭제
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 컴포넌트 */}
      {images.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={pagination.page === 1}
            >
              이전
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{pagination.page}</span>
              <span className="text-muted-foreground text-sm"> / </span>
              <span className="text-sm">{Math.ceil(total / pagination.limit)}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPagination(prev => ({ 
                ...prev, 
                page: prev.page + 1 <= Math.ceil(total / prev.limit) ? prev.page + 1 : prev.page 
              }))}
              disabled={pagination.page >= Math.ceil(total / pagination.limit)}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 